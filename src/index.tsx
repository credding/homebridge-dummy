import { configureAccessory } from "@credding/homebridge-jsx";
import { API } from "homebridge";
import { DummySwitch } from "./DummySwitch";
import { ACCESSORY_NAME, PLUGIN_IDENTIFIER } from "./settings";

export default (api: API): void => {
  api.registerAccessory(
    PLUGIN_IDENTIFIER,
    ACCESSORY_NAME,
    configureAccessory(<DummySwitch></DummySwitch>)
  );
};
