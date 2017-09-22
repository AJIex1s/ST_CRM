import {
    Component,
    OnInit,
    ViewChild,
    ViewContainerRef,
    ElementRef,
    ComponentFactoryResolver,
    ReflectiveInjector
} from '@angular/core';

import { MdSidenav } from '@angular/material'

import { User } from '../models/index';
import { UserService } from '../services/index';

import { InputFormFieldComponent } from './components/input-form-field/input-form-field.component';



@Component({
    moduleId: module.id.toString(),
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css'],
    entryComponents: [InputFormFieldComponent]
})
export class HomeComponent implements OnInit {
    @ViewChild('sidenav') sidenav: MdSidenav
    @ViewChild('workArea', { read: ViewContainerRef }) workArea: ViewContainerRef;

    users: User[] = [];
    isMobileView: boolean;
    components: any[] = [];
    formWidth: string = "450px";

    constructor(private userService: UserService,
        private resolver: ComponentFactoryResolver) { }

    ngOnInit() {
        // get users from secure api end point
        this.userService.getUsers()
            .subscribe(users => {
                this.users = users;
            });

        this.isMobileView = window.innerWidth < 601;
        window.onresize = (e) => {
            this.isMobileView = window.innerWidth < 601;
        };
        this.createComponent();
    }
    createComponent() {
        let data = {
            component: InputFormFieldComponent, inputs: {
                placeholder: "1213",
                type: 'text',
                width: 10
            }
        };
        // Inputs need to be in the following format to be resolved properly
        let inputProviders = Object.keys(data.inputs).map((inputName) => { return { provide: inputName, useValue: data.inputs[inputName] }; });
        let resolvedInputs = ReflectiveInjector.resolve(inputProviders);

        // We create an injector out of the data we want to pass down and this components injector
        let injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, this.workArea.parentInjector);

        // We create a factory out of the component we want to create
        let factory = this.resolver.resolveComponentFactory(data.component);

        // We create the component using the factory and the injector
        let component = factory.create(injector);

        // We insert the component into the dom container
        this.workArea.insert(component.hostView);

        this.components.push(component);
    }
}