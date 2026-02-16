import { FileType } from '../file-type.model';
import { FileViewer } from '../file-viewer.enum';
import { FileTypeConfig } from './file-type-config.model';

export interface FileRenderingSettings {
  preferredViewerOrder: FileViewer[];
  fileTypes: Record<FileType, FileTypeConfig>;
}
