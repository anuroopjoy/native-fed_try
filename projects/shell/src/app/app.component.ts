import {
  loadRemote as loadModuleRemote,
  registerRemotes,
} from '@module-federation/enhanced/runtime';
import { loadRemoteModule as loadNativeRemote } from '@angular-architects/native-federation';
import { NgComponentOutlet } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-shell-root',
  imports: [RouterOutlet, NgComponentOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'shell';
  component = signal(null);
  modComponent = signal(null);

  ngOnInit() {
    loadNativeRemote({
      remoteName: 'todo',
      remoteEntry: 'http://localhost:4201/remoteEntry.json',
      exposedModule: './Component',
    }).then((m) => {
      this.component.set(m.AppComponent);
    });
    registerRemotes(
      [
        {
          entry: 'http://localhost:4202/remoteEntry.js',
          name: 'mfe',
          type: 'esm',
        },
      ],
      { force: true }
    );
    loadModuleRemote<any>('mfe/Component').then((m) => {
      this.modComponent.set(m.AppComponent);
    });
  }
}
