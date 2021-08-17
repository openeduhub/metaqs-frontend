export * from './collections.service';
import { CollectionsService } from './collections.service';
export * from './default.service';
import { DefaultService } from './default.service';
export * from './demo.service';
import { DemoService } from './demo.service';
export const APIS = [CollectionsService, DefaultService, DemoService];
