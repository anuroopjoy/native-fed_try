import {
    Directive,
    effect,
    inject,
    input,
    ViewContainerRef,
} from '@angular/core';
import { getShared } from '@angular-architects/native-federation';
import {
    loadRemote as loadModuleRemote,
    registerRemotes,
    init,
} from '@module-federation/enhanced/runtime';

@Directive({ selector: '[modFedCreator]' })
export class ModuleFedCreatorDirective {
    public modFedCreator = input<{
        remoteEntry: string;
        remoteName: string;
        exposedModule: string;
    }>();
    private viewContainerRef = inject(ViewContainerRef);
    constructor() {
        // Step 2: Get metadata about libs shared via Native Federation
        const shared = getShared();

        // Step 3: Initialize Module Federation
        //  Remarks: Consider loading this MF config via the fetch API
        init({
            name: 'shell',
            remotes: [],
            shared,
        }).initializeSharing();
        effect(() => {
            if (this.modFedCreator()) {
                this.loadComponent();
            }
        });
    }
    private loadComponent(): void {
        this.viewContainerRef.clear();
        const { remoteEntry, remoteName, exposedModule } =
            this.modFedCreator()!;
        debugger;
        registerRemotes(
            [
                {
                    entry: remoteEntry,
                    name: remoteName,
                    type: 'esm',
                },
            ],
            { force: true }
        );
        loadModuleRemote<any>(`${remoteName}/${exposedModule}`).then((m) => {
            const componentRef = this.viewContainerRef.createComponent(
                m.AppComponent
            );
            componentRef.changeDetectorRef.detectChanges();
        });
    }
}
