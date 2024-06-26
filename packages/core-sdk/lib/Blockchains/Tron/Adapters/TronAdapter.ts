import TronWeb from "tronweb";
import { ERC20ABI } from "../../../Abis/ERC20";
import {
  AdapterBalance,
  Address,
  ExecutionParams,
  ExecutionResponse,
  GetDecodedTransactionWithLogsOptions,
  IBlock,
  IBlockWithTransactions,
  BlockTag,
  ITransactionWithLogs,
  ITransactionLog,
  GetTransactionsFromEventsOptions,
  TransactionStatus,
  AddressFormat,
} from "../../../Types";
import {
  AdapterNotConnectedError,
  BlockNotFoundError,
  BlockNotRecoverableError,
  NotImplementedError,
} from "../../../Errors";
import { BaseAdapter } from "../../../Adapters/BaseAdapter";
import { Opt } from "../../../Utils/Typings";
import { nonSuccessResponse, successResponse } from "../../../Adapters/Helpers";
import { Blockchains, BN } from "@<REDACTED>/utils";
import { TronChainId } from "../TronChainIds";
import { ContractInterface, ethers } from "ethers";
import { decodeTx } from "../Utils/TxDecoder";
import {
  ensureHexAddress,
  ensureTronAddress,
  mapTronTxToGlobal,
  mapTrxBlockToGlobalInterface,
  normalizeExecutionResponse,
  removeNumericKeys,
  denormalizeExecutionArgs,
  ensureHexPrefix,
  removeHexPrefix,
} from "../Utils/Normalizers";
import { onlyUnique } from "../../../Utils/Array";

const MAX_EVENT_PAGE_SIZE = 200;

type TronContractInterface = ethers.ContractInterface;
type TronProvider = TronWeb;
type Contract = any;

function textToHex(str: string): string {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    result += str.charCodeAt(i).toString(16);
  }
  return result;
}
export class TronAdapter extends BaseAdapter<
  TronContractInterface,
  TronProvider
> {
  private _provider: Opt<TronProvider>;
  protected contracts: { [nameContract: string]: Contract } = {};

  setProvider(provider: TronProvider): void {
    this._provider = provider;
  }
  getProvider(): TronProvider {
    return this._provider;
  }
  resetContracts(): void {
    this.contracts = {};
  }
  isConnected(): boolean {
    return !!this.address;
  }

  setAddress(address: string): void {
    this.address = ensureHexAddress(address);
  }

  getAddress(format: AddressFormat = AddressFormat.Native): string {
    return format === AddressFormat.Hex
      ? ensureHexAddress(this.address)
      : ensureTronAddress(this.address);
  }

  signMessage(message: string): Promise<string> {
    if (!this.isConnected()) {
      throw new AdapterNotConnectedError();
    }
    return this.getProvider().trx.signMessage(textToHex(message));
  }

  async initializeContract(
    _contractAddress: string,
    abi: TronContractInterface
  ): Promise<void> {
    const hexAddress = ensureHexAddress(_contractAddress);
    if (
      this.getContract(hexAddress) ||
      hexAddress === this.blockchainConfig.nativeToken.address
    ) {
      return;
    }

    this.contracts[hexAddress] = await this._provider.contract(
      abi as any,
      ensureTronAddress(hexAddress)
    );
  }
  protected getContract(contractAddress: string) {
    return this.contracts[ensureHexAddress(contractAddress)];
  }

  protected isNativeTokenAddress(contractAddress: string): boolean {
    return (
      contractAddress.toLowerCase() ===
      this.blockchainConfig.nativeToken.address.toLowerCase()
    );
  }

  async execute<T = any>(
    contractAddress: string,
    method: string,
    values: Partial<ExecutionParams>,
    isWrite?: boolean
  ): Promise<ExecutionResponse<T>> {
    if (
      this.isNativeTokenAddress(contractAddress) &&
      ["allowance", "approve"].includes(method)
    ) {
      return successResponse({
        method,
        value: BN(2 ** 256).toFixed(),
      });
    }

    const { args: unPreparedArgs, callValue, block } = values;
    if (block) {
      throw new NotImplementedError(
        "TronAdapter.execute on specific blocktag not supported"
      );
    }
    try {
      const contract = this.getContract(contractAddress);
      const args = denormalizeExecutionArgs(
        unPreparedArgs,
        method,
        contract.abi
      );

      if (isWrite) {
        const response = await contract[method].apply(null, args).send({
          callValue: callValue || 0,
          shouldPollResponse: false,
          keepTxID: true,
        });

        if (response) {
          return successResponse({
            method,
            hash: response,
          });
        }
      } else {
        const contractResponse = await contract[method]
          .apply(null, args)
          .call({ _isConstant: true });

        if (contractResponse) {
          const abi = this.getContractInterface(contractAddress);
          return successResponse({
            method,
            hash: "",
            value: normalizeExecutionResponse(
              method,
              abi,
              args,
              contractResponse
            ),
          });
        }
      }
      return nonSuccessResponse({
        method,
        params: args,
      });
    } catch (err) {
      return nonSuccessResponse({
        method,
        err,
      });
    }
  }

  async waitForTransaction(txnHash: string): Promise<TransactionStatus> {
    return new Promise<TransactionStatus>((resolve) => {
      const ignoreNotFoundErrors = () => {
        return;
      };
      const isSuccess = (res: any) =>
        res.ret.some((r: any) => r.contractRet === TransactionStatus.Success);
      const checkTx = () => {
        return this._provider.trx
          .getConfirmedTransaction(txnHash)
          .catch(ignoreNotFoundErrors)
          .then((res: any) => {
            if (typeof res === "object") {
              return resolve(
                isSuccess(res)
                  ? TransactionStatus.Success
                  : TransactionStatus.Failed
              );
            }
            setTimeout(checkTx, 1500);
          });
      };
      checkTx();
    });
  }
  getContractInterface(contractAddress: string): TronContractInterface {
    const contract = this.getContract(contractAddress);
    if (!contract) {
      throw new Error(`Contract ${contractAddress} not initialized`);
    }
    return contract.abi;
  }
  async getBalance(address: Address = this.address): Promise<AdapterBalance> {
    const balance = await this._provider.trx.getBalance(
      ensureTronAddress(address)
    );
    return {
      name: this.blockchainConfig.nativeToken.symbol,
      balance,
    };
  }

  async isValidNetwork(network: string): Promise<boolean> {
    return network === TronChainId.Mainnet;
  }

  isValidAddress(address: string): boolean {
    try {
      this._provider.address.fromHex(ensureHexAddress(address));
    } catch (_) {
      return false;
    }
    return true;
  }

  getAddressLink(address: string): string {
    return this.blockchainConfig.explorer.address(ensureTronAddress(address));
  }
  getTokenLink(address: string): string {
    return this.blockchainConfig.explorer.token(ensureTronAddress(address));
  }
  getTxLink(hash: string | number): string {
    return this.blockchainConfig.explorer.tx(`${hash}`);
  }

  getBlock(height: BlockTag = "latest"): Promise<IBlock> {
    height = this.sanitizeBlock(height);
    if (height === "latest") {
      return this._provider.trx
        .getCurrentBlock()
        .then(throwErrorIfNoBlock(height))
        .then(throwUnrecoverableBlockError(height))
        .then(mapTrxBlockToGlobalInterface);
    }
    return this._provider.trx
      .getBlockByNumber(height)
      .then(throwErrorIfNoBlock(height))
      .then(throwUnrecoverableBlockError(height))
      .then(mapTrxBlockToGlobalInterface);
  }

  async getBlockWithTxs(height: BlockTag): Promise<IBlockWithTransactions> {
    const [_block, txs] = await Promise.all([
      this.getBlock(height),
      this._provider.trx
        .getTransactionFromBlock(this.sanitizeBlock(height), undefined)
        .catch((error) => {
          if (error && error === "Transaction not found in block") {
            return [];
          }
          throw error;
        }),
    ]);

    const block: IBlockWithTransactions = {
      ..._block,
      transactions: [],
    };

    block.transactions = txs.map((tx: any) => mapTronTxToGlobal(block, tx));

    return block;
  }

  async initializeToken(
    tokenAddress: Address,
    abi: TronContractInterface = ERC20ABI
  ): Promise<void> {
    await this.initializeContract(tokenAddress, abi);
  }

  toHexAddress(address: string): string {
    return this._provider.address.toHex(address);
  }

  async getDecodedTransactionWithLogs(
    _transactionHash: string,
    { abis = [] }: GetDecodedTransactionWithLogsOptions<ContractInterface> = {}
  ): Promise<ITransactionWithLogs> {
    const transactionHash = removeHexPrefix(_transactionHash);
    const [_tx, _txInfo, _txEvents] = await Promise.all([
      this.getProvider().trx.getTransaction(transactionHash),
      this.getProvider().trx.getTransactionInfo(transactionHash),
      this.getProvider().getEventByTransactionID(transactionHash),
    ]);

    const tx = mapTronTxToGlobal(
      {
        number: _txInfo.blockNumber,
        timestamp: Math.floor(_txInfo.blockTimeStamp / 1000),
      },
      _tx
    );

    const logs: ITransactionLog[] = _txEvents.map((event: any) => ({
      address: ensureHexAddress(event.contract),
      name: event.name,
      signature: this.getEventSignature(event),
      tx_hash: ensureHexPrefix(transactionHash),
      topic: event.name,
      args: removeNumericKeys(event.result),
    }));

    let smartContractCall: ITransactionWithLogs["smartContractCall"];

    if (isTxCallingSmartContract(_tx)) {
      const initializedAbis = Object.values(this.contracts).map((contract) =>
        this.getContractInterface(contract.address)
      );

      const { args, method, signature } = decodeTx(_tx, [
        ...initializedAbis,
        ...abis,
      ]);
      smartContractCall = {
        method,
        signature,
        args,
      };
    }
    const status =
      _tx?.ret && _tx?.ret[0]?.contractRet === "SUCCESS"
        ? TransactionStatus.Success
        : TransactionStatus.Failed;

    return {
      ...tx,
      status,
      smartContractCall,
      logs,
    };
  }
  private getEventSignature(event: any) {
    const abi = this.getContract(event.contract)?.abi;
    if (!abi) {
      return event.name;
    }
    const eventAbi = (abi as any[]).find(
      (def) => def.type === "event" && def.name === event.name
    );
    if (!eventAbi) {
      return event.name;
    }
    const inputTypes = eventAbi.inputs.map((input: any) => input.type);

    return `${event.name}(${inputTypes.join(",")})`;
  }
  async getTransactionsFromEvents(
    contractHexAddress: string,
    { fromBlock, toBlock }: GetTransactionsFromEventsOptions = {}
  ): Promise<string[]> {
    const contractAddress = ensureTronAddress(contractHexAddress);
    const events = await this.getProvider().getEventResult(contractAddress, {
      size: MAX_EVENT_PAGE_SIZE,
    });

    return events
      .filter(eventBlockRangeFilter(fromBlock, toBlock))
      .map((event) => event.transaction)
      .filter(onlyUnique);
  }

  convertAddressTo(address: string, format: AddressFormat): string {
    if (format === AddressFormat.Hex) {
      return ensureHexAddress(address);
    }
    return ensureTronAddress(address);
  }
}

function isTxCallingSmartContract(_tx: any) {
  return ["TriggerSmartContract"].includes(_tx?.raw_data?.contract[0]?.type);
}

function throwErrorIfNoBlock(height: any) {
  return (block: any) => {
    if (!block) {
      throw new BlockNotFoundError(height, Blockchains.Tron);
    }
    return block;
  };
}

const UNRECOVERABLE_ERRORS = [
  "class com.alibaba.fastjson.JSONException : illegal state. 0",
];
function throwUnrecoverableBlockError(height: any) {
  return (block: any) => {
    if (block && block.Error) {
      if (UNRECOVERABLE_ERRORS.includes(block.Error)) {
        throw new BlockNotRecoverableError(height, Blockchains.Tron);
      }
    }
    return block;
  };
}

function eventBlockRangeFilter(fromBlock: number, toBlock: number) {
  return (event: { block: number }) => {
    const min = !fromBlock || event.block >= fromBlock;
    const max = !toBlock || event.block <= toBlock;
    return min && max;
  };
}
