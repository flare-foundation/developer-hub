import { createConfig, http } from "wagmi";
import { flare, flareTestnet, songbird, songbirdTestnet } from "wagmi/chains";
import { baseAccount, injected } from "wagmi/connectors";

export function getConfig() {
  return createConfig({
    chains: [flare, flareTestnet, songbird, songbirdTestnet],
    connectors: [injected(), baseAccount()],
    ssr: true,
    transports: {
      [flareTestnet.id]: http("https://coston2-api.flare.network/ext/C/rpc"),
      [flare.id]: http(),
      [songbird.id]: http(),
      [songbirdTestnet.id]: http(),
    },
  });
}

declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
