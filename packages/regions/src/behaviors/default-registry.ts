import {AutoPopulateBehavior} from './auto-populate-behavior';
import {BehaviorRegistry} from './behavior-registry';

const defaultRegistry = new BehaviorRegistry();
defaultRegistry.register(AutoPopulateBehavior);
export const defaultBehaviorRegistry = defaultRegistry;
