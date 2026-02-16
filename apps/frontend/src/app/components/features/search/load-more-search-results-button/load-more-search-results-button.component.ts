import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { NodeModel } from '../../../../models/node.model';
import { NodeService } from '../../../../services/node/node.service';
import { SearchService } from '../../../../services/search/search.service';

@Component({
  selector: 'app-load-more-search-results-button',
  imports: [TranslatePipe],
  templateUrl: './load-more-search-results-button.component.html',
  styleUrl: './load-more-search-results-button.component.scss',
})
export class LoadMoreSearchResultsButtonComponent {
  constructor(
    public search: SearchService,
    public nodes: NodeService,
  ) {}

  async loadMore() {
    if (!this.search.isLoading.value) {
      const oldNumNodes = this.search.results.value.nodes?.length;
      await this.search.execute(false, false);
      const newNumNodes = this.search.results.value.nodes?.length;

      const nodesHaveBeenAdded =
        newNumNodes && oldNumNodes && newNumNodes > oldNumNodes;
      if (!nodesHaveBeenAdded) {
        return;
      }

      const focusOnNewNode = () => {
        const newNode: NodeModel | undefined =
          this.search.results.value.nodes?.[oldNumNodes];
        if (!newNode) {
          return;
        }
        const newNodeId = this.nodes.getId(newNode);
        const searchResultElem: HTMLElement | null = document.querySelector(
          `[data-scroll-id="${encodeURIComponent(newNodeId)}"] a.node-result-item`,
        );
        searchResultElem?.focus();
      };

      setTimeout(() => {
        focusOnNewNode();
      }, 1);
    }
  }
}
