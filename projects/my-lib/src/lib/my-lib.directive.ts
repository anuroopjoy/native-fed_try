import {
    Directive,
    effect,
    inject,
    input,
    ViewContainerRef,
} from '@angular/core';
import {
    loadRemote as loadModuleRemote,
    registerRemotes,
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
