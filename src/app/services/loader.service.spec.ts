import { TestBed } from '@angular/core/testing';

import {FileDict, LoaderService} from './loader.service';
import {Howl} from "howler";

describe('LoaderService', () => {
  let files: FileDict[];

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    const service: LoaderService = TestBed.get(LoaderService);
    expect(service).toBeTruthy();
  });

  it('should preload all images', async() => {
    const service: LoaderService = TestBed.get(LoaderService);
    files = [
      {name: 'RedFighter', type: 'image', src: '/assets/game-assets/RedFighter.png'},
      {name: 'BlueFighter', type: 'image', src: '/assets/game-assets/BlueFighter.png'},
      {name: 'A318', type: 'image', src: '/assets/game-assets/A318.png'}
    ];
    service.preload(files);
    let images: HTMLImageElement[] = [];
    await service.resourcesLoaded$.subscribe(() => {
      images.push(
        service.getImage('RedFighter'),
        service.getImage('BlueFighter'),
        service.getImage('A318')
      );
      expect(images.length).toBe(3);
    });
  });

  it('should preload all audio files', async() => {
    const service: LoaderService = TestBed.get(LoaderService);
    files = [
      {name: 'Explosion01', type: 'audio', src: '/assets/game-assets/explosion01.mp3'},
      {name: 'Explosion02', type: 'audio', src: '/assets/game-assets/explosion02.mp3'},
    ];
    service.preload(files);
    let audioFiles: Howl[] = [];
    await service.resourcesLoaded$.subscribe(() => {
      audioFiles.push(
        service.getAudio('Explosion01'),
        service.getAudio('Explosion02')
      );
      expect(audioFiles.length).toBe(2);
    });

  });
});
