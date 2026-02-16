import { NodeTypeComponent } from '../../../components/features/node/node-types/node-type/node-type.component';
import {
  RenderComponentsSettings,
  RenderMode,
} from '../../../models/settings/render-component-settings.type';

export const renderComponentSettings: RenderComponentsSettings = {
  [RenderMode.ByType]: [],
  [RenderMode.ByPredicate]: [
    {
      component: NodeTypeComponent,
      predicates: [
        'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
        'https://schema.org/additionalType',
        'http://www.wikidata.org/entity/P31',
      ],
      requiresExplicitRendering: true,
    },
  ],
};

// Example:
// [RenderMode.ByType]: [
//   {
//     component: SampleTypeRenderComponentComponent,
//     predicates: [
//       '...',
//     ],
//   },
// ],
