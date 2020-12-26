import {
  Accessory,
  BooleanCharacteristic,
  Component,
  Service,
  useAccessoryConfig,
  useEffect,
  useHomebridgeApi,
  useLogger,
  useRef,
} from "@credding/homebridge-jsx";
import { AccessoryConfig, Service as HAPService } from "homebridge";
import storage from "node-persist";

type DummySwitchConfig = {
  stateful: boolean;
  reverse: boolean;
  time: number;
};

export const DummySwitch = (): Component<AccessoryConfig> => {
  const logger = useLogger();
  const {
    name,
    stateful,
    reverse,
    time,
  } = useAccessoryConfig<DummySwitchConfig>();
  const { hap, user } = useHomebridgeApi();

  const service = useRef<HAPService>();

  useEffect(() => void init());

  const init = async () => {
    await storage.init({ dir: user.persistPath(), forgiveParseErrors: true });
    if (stateful) {
      const cachedState = (await storage.getItem(name)) as boolean;
      service.current?.setCharacteristic(hap.Characteristic.On, !!cachedState);
    }
  };

  const setOn = async (on: boolean) => {
    logger.info(`Setting switch to ${on.toString()}`);

    if (stateful) {
      await storage.setItem(name, on);
    } else if (on != reverse) {
      setTimeout(() => {
        service.current?.setCharacteristic(hap.Characteristic.On, reverse);
      }, time);
    }
  };

  return (
    <Accessory>
      <Service type={hap.Service.Switch} ref={service}>
        <BooleanCharacteristic
          type={hap.Characteristic.On}
          onSet={setOn}
        ></BooleanCharacteristic>
      </Service>
    </Accessory>
  );
};
