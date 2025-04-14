import { FeaturesApi } from "../features";
import { pronounsService as apiPronounsAlejoIo } from "./pronouns/api.pronouns.alejo.io";
import { pronounsService as pronoundbOrg } from "./pronouns/pronoundb.org";

const knownServices = {
  "api.pronouns.alejo.io": apiPronounsAlejoIo,
  "pronoundb.org": pronoundbOrg,
};

type Service = (typeof knownServices)[keyof typeof knownServices];

const fontRenderer = {
  getCachedImage(text: string) {
    return document.createTextNode(text);
  },
};

export const pronounsReplacer = {
  async replacePronouns(
    node: Element,
    userId: string | undefined,
    username: string | undefined,
    options: { capitalizePronouns: boolean; services: Service[] },
  ) {
    // try one service after the other and not in parallel
    // starting with the service of the highest priority
    for (const service of options.services) {
      const pronouns = await service.getPronouns(userId, username);
      if (pronouns != null) {
        node.replaceChildren(
          fontRenderer.getCachedImage(
            options.capitalizePronouns ? pronouns : pronouns.toLowerCase(),
          ),
        );
        // first service has preference
        break;
      }
    }
  },
  async load(api: FeaturesApi) {
    if (api.settings.pronouns.length > 0) {
      const services: Service[] = [];
      for (const pronounsApi of api.settings.pronouns) {
        if (pronounsApi in knownServices) {
          services.push(
            knownServices[pronounsApi as keyof typeof knownServices],
          );
        }
      }
      api.forClass("pronouns", Element, (nodes, context) => {
        if (context.service.includes("twitch")) {
          // only do this for twitch
          this.replacePronouns(nodes, context.user.id, context.user.name, {
            capitalizePronouns: api.settings.capitalizePronouns,
            services,
          });
        }
      });
      await Promise.all(services.map((service) => service.load(api)));
    }
  },
};
