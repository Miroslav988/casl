import { defineAbility } from "@casl/ability";

export default (user) =>
  defineAbility((can) => {
    can("read", "all");
    if (user.role === "Text") {
      can("manage", "Text");
    } else {
      can("manage", "Links");
    }
  });
