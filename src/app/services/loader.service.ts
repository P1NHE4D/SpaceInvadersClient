import { Injectable } from '@angular/core';
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private _loadCount: number;
  private _resourceCount: number;
  private _loadedImages: Map<string, HTMLImageElement>;
  private _loadedAudioFiles: Map<string, HTMLAudioElement>;
  private _resourcesLoadedSource = new Subject<number>();

  constructor() {
    this._loadCount = 0;
    this._resourceCount = 0;
    this._loadedImages = new Map<string, HTMLImageElement>();
    this._loadedAudioFiles = new Map<string, HTMLAudioElement>();
  }

  resourcesLoaded$ = this._resourcesLoadedSource.asObservable();

  /**
   * Fetches a pre-loaded image
   * @param name name of the image
   * @return returns an image
   */
  getImage(name: string): HTMLImageElement {
    return this._loadedImages.get(name);
  }

  /**
   * Fetches a pre-loaded audio file
   * @param name name of the audio file
   * @return returns an audio file
   */
  getAudio(name: string): HTMLAudioElement {
    return this._loadedAudioFiles.get(name);
  }

  /**
   * Pre-loads static files used in the application
   * Supported file types: image, audio
   * @param resources FileDict array containing the resources to be loaded
   */
  preload(resources: FileDict[]): void {
    let onResourceLoaded = () => ++this._loadCount;

    for (let resource of resources) {
      ++this._resourceCount;
      this.load(resource, onResourceLoaded, () => {
        throw new Error(`Failed to load resource ${resource.src}`)
      });
    }
    this.resourcesLoaded();
  }

  private resourcesLoaded(): void {
    if (this._loadCount === this._resourceCount) {
      this._resourcesLoadedSource.next();
    } else {
      setTimeout(() => {
        this.resourcesLoaded();
      }, 100);
    }
  }

  private preloadImage(img: FileDict, onload: () => any, onerror: () => any): void {
    this._loadedImages.set(img.name, new Image());
    this._loadedImages.get(img.name).onload = () => {
      onload();
    };
    this._loadedImages.get(img.name).onerror = () => {
      onerror();
    };
    this._loadedImages.get(img.name).src = img.src;
  }

  private preloadAudio(audio: FileDict, onload: () => any, onerror: () => any): void {
    this._loadedAudioFiles.set(audio.name, new Audio());
    this._loadedAudioFiles.get(audio.name).src = audio.src;
    this._loadedAudioFiles.get(audio.name).load();
    this._loadedAudioFiles.get(audio.name).onerror = () => {
      onerror();
    };
    onload();

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
