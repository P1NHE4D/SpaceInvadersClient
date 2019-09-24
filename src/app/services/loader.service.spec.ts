import { TestBed } from '@angular/core/testing';

import {FileDict, LoaderService} from './loader.service';

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
      {name: 'RedFighter', type: 'image', src: '/assets/gameObjects/RedFighter.png'},
      {name: 'BlueFighter', type: 'image', src: '/assets/gameObjects/BlueFighter.png'},
      {name: 'A318', type: 'image', src: '/assets/gameObjects/A318.png'}
    ];
    service.preload(files);
    let images: HTMLImageElement[] = [];
    await service.resourcesLoaded$.subscribe(() => {
      images.push(
        service.getImage('RedFighter'),
        service.getImage('BlueFighter'),
        service.getImage('A318')
      );
    });
    expect(images.length).toBe(3);
  });

  it('should preload all audio files', async() => {
    const service: LoaderService = TestBed.get(LoaderService);
    files = [
      {name: 'Explosion', type: 'audio', src: '/assets/gameObjects/explosion.wav'},
    ];
    service.preload(files);
    let audioFiles: HTMLAudioElement[] = [];
    await service.resourcesLoaded$.subscribe(() => {
      audioFiles.push(
        service.getAudio('Explosion')
      );
    });
    expect(audioFiles.length).toBe(1);
  });
});
