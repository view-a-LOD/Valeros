import {
  AsyncPipe,
  Location,
  NgClass,
  NgTemplateOutlet,
} from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  featherArrowLeft,
  featherArrowRight,
  featherChevronRight,
} from '@ng-icons/feather-icons';
import { TranslatePipe } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Settings } from '../../../config/settings';
import { Direction, NodeModel } from '../../../models/node.model';
import { ViewModeSetting } from '../../../models/settings/view-mode-setting.enum';
import { SparqlNodeParentModel } from '../../../models/sparql/sparql-node-parent.model';
import { ThingWithLabelModel } from '../../../models/thing-with-label.model';
import { TypeModel } from '../../../models/type.model';
import { LabelsCacheService } from '../../../services/cache/labels-cache.service';
import { DataService } from '../../../services/data.service';
import { DetailsService } from '../../../services/details.service';
import { NodeFileService } from '../../../services/node/node-file.service';
import { NodeSectionService } from '../../../services/node/node-section.service';
import { NodeService } from '../../../services/node/node.service';
import { RoutingService } from '../../../services/routing.service';
import { SettingsService } from '../../../services/settings.service';
import { SparqlService } from '../../../services/sparql.service';
import { MiradorComponent } from '../file-viewers/mirador/mirador.component';
import { SnippetComponent } from '../snippet/snippet.component';
import { NodeDetailsButtonComponent } from './node-details-button/node-details-button.component';
import { NodeEndpointComponent } from './node-endpoint/node-endpoint.component';
import { NodeHierarchyComponent } from './node-hierarchy/node-hierarchy.component';
import { NodeLabelComponent } from './node-label/node-label.component';
import { NodeLinkComponent } from './node-link/node-link.component';
import { NodePermalinkButtonComponent } from './node-permalink-button/node-permalink-button.component';
import { FileRendererComponent } from './node-render-components/predicate-render-components/file-renderer/file-renderer.component';
import { NodeRendererComponent } from './node-renderer/node-renderer.component';
import { NodeTableRowComponent } from './node-table-row/node-table-row.component';
import { NodeTypesComponent } from './node-types/node-types.component';

@Component({
  selector: 'app-node',
  imports: [
    NodeHierarchyComponent,
    NodeTypesComponent,
    AsyncPipe,
    NodeLinkComponent,
    NodeRendererComponent,
    NodeEndpointComponent,
    NodeTableRowComponent,
    NgClass,
    NodeDetailsButtonComponent,
    NodePermalinkButtonComponent,
    RouterLink,
    TranslatePipe,
    FileRendererComponent,
    MiradorComponent,
    SnippetComponent,
    NodeLabelComponent,
    NgTemplateOutlet,
  ],
  templateUrl: './node.component.html',
  styleUrl: './node.component.scss',
})
export class NodeComponent implements OnInit, OnChanges {
  @Input() node?: NodeModel;
  parents: ThingWithLabelModel[] = [];

  id?: string;
  title = '';
  types: TypeModel[] = [];
  files: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  filesLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  canShowUsingFileRenderer: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  showTitle = this.settings.hasViewModeSetting(ViewModeSetting.ShowTitle);
  showParents = this.settings.hasViewModeSetting(ViewModeSetting.ShowParents);
  showTypes = this.settings.hasViewModeSetting(ViewModeSetting.ShowTypes);
  showOrganization = this.settings.hasViewModeSetting(
    ViewModeSetting.ShowOrganization,
  );
  showDetailsButton = this.settings.hasViewModeSetting(
    ViewModeSetting.ShowDetailsButton,
  );
  showPermalinkButton = this.settings.hasViewModeSetting(
    ViewModeSetting.ShowPermalinkButton,
  );
  showSnippet = this.settings.hasViewModeSetting(ViewModeSetting.ShowSnippet);

  private shouldShowIIIFSubject = new BehaviorSubject<boolean>(false);
  shouldShowIIIF$ = this.shouldShowIIIFSubject.asObservable();

  constructor(
    public nodes: NodeService,
    public sparql: SparqlService,
    public data: DataService,
    public cache: LabelsCacheService,
    public settings: SettingsService,
    public details: DetailsService,
    public router: Router,
    public routing: RoutingService,
    public location: Location,
    public labelsCache: LabelsCacheService,
    public nodeSection: NodeSectionService,
    public nodeFile: NodeFileService,
  ) {}

  ngOnInit() {
    void this.retrieveParents();
    void this.checkShouldShowIIIF();
    this.initTitle();
    this.initTypes();
    this.initFiles();

    if (!this.node) {
      return;
    }

    this.id = this.nodes.getId(this.node);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['node']) {
      void this.checkShouldShowIIIF();
    }
  }

  initTitle() {
    const titles = this.nodes
      .getObjValues(this.node, Settings.predicates.label)
      .map((title) => title.trim());

    if (!titles || titles.length === 0) {
      return;
    }

    this.title = titles[0];
  }

  async getHopFileUrls(nodeId: string): Promise<string[]> {
    const hopFilePromises = Settings.predicates.hopFiles.map((hopFilePreds) =>
      this.sparql.getObjIds(nodeId, hopFilePreds),
    );

    const hopFileUrls = await Promise.all(hopFilePromises);
    return hopFileUrls.flat();
  }

  async initFiles() {
    if (!this.node) {
      return;
    }

    let files = this.nodeFile.getFiles(this.node);

    const shouldFetchHopFiles =
      this.details.isShowing() || Settings.predicates.fetchHopFilesOnSearchPage;
    if (shouldFetchHopFiles) {
      const nodeId = this.nodes.getId(this.node);
      const hopFileUrls = await this.getHopFileUrls(nodeId);
      files = [...files, ...hopFileUrls];
    }

    this.files.next(files);
  }

  initTypes() {
    // TODO: Render incoming types in the table view?
    const types: TypeModel[] = this.nodes
      .getObjValues(this.node, Settings.predicates.type, Direction.Outgoing)
      .map((typeId) => {
        return { id: typeId };
      });

    types.forEach((type) => {
      void this.cache.cacheLabelForId(type.id);
    });

    this.types = types;
  }

  async retrieveParents() {
    if (!this.node || !this.showParents) {
      return;
    }

    const response: SparqlNodeParentModel[] = await this.sparql.getAllParents(
      this.node,
    );

    this.parents = this.data.getOrderedParentsFromSparqlResults(
      this.nodes.getId(this.node),
      response,
    );
  }

  get sectionNextToTableWidth(): string {
    if (window.innerWidth < 640) {
      return '100%';
    }

    return this.details.showing.value
      ? Settings.ui.sectionNextToTableWidth.details
      : Settings.ui.sectionNextToTableWidth.search;
  }

  shouldShowFileNextToTable(): boolean {
    return this.nodeSection.shouldShowFileNextToTable(
      this.files.value,
      this.canShowUsingFileRenderer.value,
    );
  }

  shouldShowSectionNextToTable(): Observable<boolean> {
    return this.nodeSection.shouldShowSectionNextToTable(
      this.files.value,
      this.canShowUsingFileRenderer.value,
      this.shouldShowIIIF$,
    );
  }

  async checkShouldShowIIIF() {
    const shouldShow = await this.nodeSection.checkShouldShowIIIF(
      this.node,
      this.files.value,
      this.canShowUsingFileRenderer.value,
    );
    this.shouldShowIIIFSubject.next(shouldShow);
  }

  getSectionNextToTableWidth(): string {
    return this.details.showing.value
      ? Settings.ui.sectionNextToTableWidth.details
      : Settings.ui.sectionNextToTableWidth.search;
  }

  protected readonly Settings = Settings;
  protected readonly featherChevronRight = featherChevronRight;
  protected readonly featherArrowRight = featherArrowRight;
  protected readonly featherArrowLeft = featherArrowLeft;
  protected readonly encodeURIComponent = encodeURIComponent;
}
