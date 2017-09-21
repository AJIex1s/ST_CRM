import { Component, OnInit, ViewChild } from '@angular/core';
import { MdSidenav } from '@angular/material'

import { User } from '../models/index';
import { UserService } from '../services/index';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css']
})

export class HomeComponent implements OnInit {
    @ViewChild('sidenav') sidenav: MdSidenav
    users: User[] = [];
    isMobileView: boolean;

    constructor(private userService: UserService) { }

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
    }
}