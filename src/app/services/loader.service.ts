import { Injectable } from '@angular/core';
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loadCount: number;
  private resourceCount: number;
  private loadedImages: Map<string, HTMLImageElement>;
  private loadedAudioFiles: Map<string, HTMLAudioElement>;
  private resourcesLoadedSource = new Subject<number>();

  constructor() {
    this.loadCount = 0;
    this.resourceCount = 0;
    this.loadedImages = new Map<string, HTMLImageElement>();
    this.loadedAudioFiles = new Map<string, HTMLAudioElement>();
  }

  resourcesLoaded$ = this.resourcesLoadedSource.asObservable();

  getImage(name: string): HTMLImageElement {
    return this.loadedImages.get(name);
  }

  getAudio(name: string): HTMLAudioElement {
    return this.loadedAudioFiles.get(name);
  }

  /**
   * Pre-loads static files used in the application
   * Supported file types: image, audio
   * @param resources FileDict array containing the resources to be loaded
   */
  preload(resources: FileDict[]): void {
    let onResourceLoaded = () => ++this.loadCount;

    for (let resource of resources) {
      ++this.resourceCount;
      this.load(resource, onResourceLoaded, () => {
        throw new Error(`Failed to load resource ${resource.src}`)
      });
    }
    this.resourcesLoaded();
  }

  private resourcesLoaded(): void {
    if (this.loadCount === this.resourceCount) {
      this.resourcesLoadedSource.next();
    } else {
      setTimeout(() => {
        this.resourcesLoaded();
      }, 100);
    }
  }

  private preloadImage(img: FileDict, onload: () => any, onerror: () => any): void {
    this.loadedImages.set(img.name, new Image());
    this.loadedImages.get(img.name).onload = () => {
      onload();
    };
    this.loadedImages.get(img.name).onerror = () => {
      onerror();
    };
    this.loadedImages.get(img.name).src = img.src;
  }

  private preloadAudio(audio: FileDict, onload: () => any, onerror: () => any): void {
    this.loadedAudioFiles.set(audio.name, new Audio());
    this.loadedAudioFiles.get(audio.name).src = audio.src;
    this.loadedAudioFiles.get(audio.name).load();
    onload();
    this.loadedAudioFiles.get(audio.name).onerror = () => {
      onerror();
    };

  }

  private load(resource, onload: () => any, onerror: () => any): void {
    switch(resource.type) {
      case "image":
        this.preloadImage(resource, onload, onerror);
        break;
      case "audio":
        this.preloadAudio(resource, onload, onerror);
        break;
      default:
        throw new Error(`Type ${resource.type} is not supported`)
    }
  }

}

export interface FileDict {
  name: string;
  type: string;
  src: string;
}
