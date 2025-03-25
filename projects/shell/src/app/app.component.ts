import {
    loadRemote as loadModuleRemote,
    registerRemotes,
} from '@module-federation/enhanced/runtime';
import { loadRemoteModule as loadNativeRemote } from '@angular-architects/native-federation';
import { NgComponentOutlet } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MyLibComponent, ModuleFedCreatorDirective } from 'my-lib';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-shell-root',
    imports: [
        RouterOutlet,
        NgComponentOutlet,
        MyLibComponent,
        ModuleFedCreatorDirective,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
    title = 'shell';
    component = signal(null);
    modComponent = signal(null);
    client = inject(HttpClient);
    modInput = signal({
        remoteEntry: 'http://localhost:4202/remoteEntry.js',
        remoteName: 'mfe',
        exposedModule: 'Component',
    });
    ngOnInit() {
        loadNativeRemote({
            remoteName: 'todo',
            remoteEntry: 'http://localhost:4201/remoteEntry.json',
            exposedModule: './Component',
        }).then((m) => {
            this.component.set(m.AppComponent);
        });
        // registerRemotes(
        //     [
        //         {
        //             entry: 'http://localhost:4202/remoteEntry.js',
        //             name: 'mfe',
        //             type: 'esm',
        //         },
        //     ],
        //     { force: true }
        // );
        // loadModuleRemote<any>('mfe/Component').then((m) => {
        //     this.modComponent.set(m.AppComponent);
        // });
    }
    getData() {
        this.client.get('/api/data').subscribe((data) => {
            console.log(data);
        });
    }
}
