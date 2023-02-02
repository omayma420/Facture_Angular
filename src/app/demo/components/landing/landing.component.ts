import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnDestroy {

    subscription: Subscription;

    darkMode: boolean = false;

    displayModal: boolean = false;;

    images: any[] = [
        { name: 'chat', src: 'assets/demo/images/landing/chat.png' },
        { name: 'mail', src: 'assets/demo/images/landing/mail.png' },
        { name: 'kanban', src: 'assets/demo/images/landing/kanban.png' },
        { name: 'task-list', src: 'assets/demo/images/landing/task-list.png' },
        { name: 'blog', src: 'assets/demo/images/landing/blog.png' },
    ]

    activeImage:string='assets/demo/images/landing/chat.png'
    activeLink=0

    constructor(public router: Router, private layoutService: LayoutService,) {
        this.subscription = this.layoutService.configUpdate$.subscribe(config => {
            this.darkMode = config.colorScheme === 'dark' || config.colorScheme === 'dim' ? true : false;
        });
    }

    showModalDialog() {
        this.displayModal = true;
    }

    changeImageOnHover(i:number) {
        this.activeImage=this.images[i].src;
        this.activeLink=i
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
