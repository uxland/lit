import {AutoPopulateBehavior} from './auto-populate-behavior.js';
import {BehaviorRegistry} from './behavior-registry.js';

const defaultRegistry = new BehaviorRegistry();
defaultRegistry.register(AutoPopulateBehavior);
export const defaultBehaviorRegistry = defaultRegistry;
