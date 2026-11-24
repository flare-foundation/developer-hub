import { coston2 } from "@flarenetwork/flare-wagmi-periphery-package";
import type { Address } from "viem";
import { dropsToXrp } from "xrpl";
import { publicClient } from "./utils/client";
import { getContractAddressByName } from "./utils/flare-contract-registry";
import { getAssetManagerSettings } from "./settings";

const MAX_REDEMPTION_QUEUE_PAGES = 100;

type RedemptionTicket = {
  redemptionTicketId: bigint;
  agentVault: Address;
  ticketValueUBA: bigint;
};

type RedemptionQueueParameters = {
  assetManagerAddress: Address;
  blockNumber: bigint;
  pageSize: bigint;
};

type AgentQueueSummary = {
  ticketCount: number;
  valueUBA: bigint;
};

function formatUba(uba: bigint): string {
  return `${uba.toString()} UBA (${dropsToXrp(uba.toString())} XRP)`;
}

async function readRedemptionQueueParameters(): Promise<RedemptionQueueParameters> {
  const assetManagerAddress =
    await getContractAddressByName("AssetManagerFXRP");
  const blockNumber = await publicClient.getBlockNumber();
  const settings = await getAssetManagerSettings(
    assetManagerAddress,
    blockNumber,
  );

  const pageSize = BigInt(settings.maxRedeemedTickets);
  if (pageSize === 0n) {
    throw new Error(
      "maxRedeemedTickets is 0; cannot page the redemption queue.",
    );
  }

  return { assetManagerAddress, blockNumber, pageSize };
}

async function fetchRedemptionTickets({
  assetManagerAddress,
  blockNumber,
  pageSize,
}: {
  assetManagerAddress: Address;
  blockNumber: bigint;
  pageSize: bigint;
}): Promise<RedemptionTicket[]> {
  const tickets: RedemptionTicket[] = [];
  let firstRedemptionTicketId = 0n;

  for (let page = 0; page < MAX_REDEMPTION_QUEUE_PAGES; page++) {
    const [queue, nextRedemptionTicketId] = await publicClient.readContract({
      address: assetManagerAddress,
      abi: coston2.iAssetManagerAbi,
      functionName: "redemptionQueue",
      args: [firstRedemptionTicketId, pageSize],
      blockNumber,
    });

    tickets.push(...queue);

    if (nextRedemptionTicketId === 0n) {
      return tickets;
    }

    firstRedemptionTicketId = nextRedemptionTicketId;
  }

  throw new Error(
    `Redemption queue pagination exceeded ${MAX_REDEMPTION_QUEUE_PAGES} pages.`,
  );
}

function totalTicketValueUBA(tickets: RedemptionTicket[]): bigint {
  return tickets.reduce((sum, ticket) => sum + ticket.ticketValueUBA, 0n);
}

function groupTicketsByAgent(
  tickets: RedemptionTicket[],
): Map<Address, AgentQueueSummary> {
  const byAgent = new Map<Address, AgentQueueSummary>();

  for (const ticket of tickets) {
    const summary = byAgent.get(ticket.agentVault) ?? {
      ticketCount: 0,
      valueUBA: 0n,
    };
    summary.ticketCount += 1;
    summary.valueUBA += ticket.ticketValueUBA;
    byAgent.set(ticket.agentVault, summary);
  }

  return byAgent;
}

function printRedemptionQueueHeader({
  assetManagerAddress,
  blockNumber,
  pageSize,
}: RedemptionQueueParameters): void {
  console.log("AssetManagerFXRP address:", assetManagerAddress);
  console.log("Block:", blockNumber.toString());
  console.log("Max redeemed tickets:", pageSize.toString(), "\n");
}

function printRedemptionTicket(index: number, ticket: RedemptionTicket): void {
  console.log(
    `#${index + 1} ticket ${ticket.redemptionTicketId.toString()} agent ${ticket.agentVault} ${formatUba(ticket.ticketValueUBA)}`,
  );
}

function printQueueTotals(tickets: RedemptionTicket[]): void {
  const totalValueUBA = totalTicketValueUBA(tickets);
  console.log("\nTickets:", tickets.length);
  console.log("Total value:", formatUba(totalValueUBA), "\n");
}

function printAgentSummaries(byAgent: Map<Address, AgentQueueSummary>): void {
  console.log("By agent:");
  for (const [agentVault, summary] of byAgent) {
    const ticketLabel = summary.ticketCount === 1 ? "ticket" : "tickets";
    console.log(
      `${agentVault}  ${summary.ticketCount} ${ticketLabel}  ${formatUba(summary.valueUBA)}`,
    );
  }
}

function printRedemptionQueue(tickets: RedemptionTicket[]): void {
  if (tickets.length === 0) {
    console.log("Redemption queue is empty.");
    return;
  }

  tickets.forEach((ticket, index) => printRedemptionTicket(index, ticket));
  printQueueTotals(tickets);
  printAgentSummaries(groupTicketsByAgent(tickets));
}

async function main() {
  const parameters = await readRedemptionQueueParameters();
  printRedemptionQueueHeader(parameters);

  const tickets = await fetchRedemptionTickets(parameters);
  printRedemptionQueue(tickets);
}

void main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
