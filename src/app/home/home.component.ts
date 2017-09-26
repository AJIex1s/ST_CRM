import {
    Component,
    Type,
    ComponentRef,
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

import { TextFieldComponent, BaseFormControl } from './components/index';
import {
    InputFormControlParams,
    FormControlComponentsFactory,
    HtmlInputType,
    HtmlPosition
} from './classes';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css'],
    entryComponents: [TextFieldComponent]
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

    dragStart(e: DragEvent) {
        console.log('start', e);
    }
    
    dragEnd(e: DragEvent) {
        let workAreaElement = (this.workArea.element.nativeElement as HTMLDivElement).parentElement.parentElement;
        if(!workAreaElement)
            return;
        let workAreaBoundingRect = workAreaElement.getBoundingClientRect();
        let workAreaTop = workAreaBoundingRect.top;
        let workAreaLeft = workAreaBoundingRect.left;
        let workAreaBottom = workAreaBoundingRect.bottom;
        let workAreaRight = workAreaBoundingRect.right;

        let elementBoundingRect = e.srcElement.getBoundingClientRect();
        let elementTop = e.clientY;
        let elementLeft = e.clientX;
        let elementBottom = e.clientY + e.srcElement.clientHeight;
        let elementRight = e.clientX + e.srcElement.clientWidth;

        console.log(elementBoundingRect, workAreaBoundingRect);
        if(elementTop > workAreaTop && 
            elementLeft > workAreaLeft && 
            elementRight < workAreaRight && 
            elementBottom < workAreaBottom) 
            this.createComponent();
    }
    createComponent() {
        let componentFactory: FormControlComponentsFactory = new FormControlComponentsFactory(this.resolver);
        let params = new InputFormControlParams(HtmlInputType.text,
            'custom placeholder', HtmlPosition.static, 50, 10);
        
        let component = componentFactory.createComponent(TextFieldComponent, params);
        
        this.workArea.insert(component.hostView);
        
        this.components.push(component);
    }
}