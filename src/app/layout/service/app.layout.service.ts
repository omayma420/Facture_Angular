import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface AppConfig {
    inputStyle: string;
    colorScheme: string;
    theme: string;
    ripple: boolean;
    menuMode: string;
    scale: number;
    menuTheme: string;
    topbarTheme: string;
}

interface LayoutState {
    staticMenuDesktopInactive: boolean;
    overlayMenuActive: boolean;
    profileSidebarVisible: boolean;
    configSidebarVisible: boolean;
    staticMenuMobileActive: boolean;
    menuHoverActive: boolean;
    topbarMenuActive: boolean;
    revealMenuActive: boolean;
    drawerMenuActive: boolean;
    anchored: boolean,
}

@Injectable({
    providedIn: 'root',
})
export class LayoutService {

    config: AppConfig = {
        ripple: false,
        inputStyle: 'outlined',
        menuMode: 'static',
        colorScheme: 'light',
        theme: 'indigo',
        scale: 14,
        menuTheme: 'menu_light',
        topbarTheme: 'topbar_light'
    };

    state: LayoutState = {
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        profileSidebarVisible: false,
        configSidebarVisible: false,
        staticMenuMobileActive: false,
        menuHoverActive: false,
        revealMenuActive: false,
        topbarMenuActive: false,
        drawerMenuActive: false,
        anchored: false
    };

    private configUpdate = new Subject<AppConfig>();

    private overlayOpen = new Subject<any>();

    private topbarMenuOpen = new Subject<any>();

    topbarMenuOpen$ = this.topbarMenuOpen.asObservable();

    configUpdate$ = this.configUpdate.asObservable();

    overlayOpen$ = this.overlayOpen.asObservable();

    onMenuToggle() {
        if (this.isOverlay()) {
            this.state.overlayMenuActive = !this.state.overlayMenuActive;

            if (this.state.overlayMenuActive) {
                this.overlayOpen.next(null);
            }
        }

        if (this.isDesktop()) {
            this.state.staticMenuDesktopInactive = !this.state.staticMenuDesktopInactive;
        }
        else {
            this.state.staticMenuMobileActive = !this.state.staticMenuMobileActive;

            if (this.state.staticMenuMobileActive) {
                this.overlayOpen.next(null);
            }
        }
    }
    
    onTopbarMenuToggle() {
        this.state.topbarMenuActive = !this.state.topbarMenuActive;
        if (this.state.topbarMenuActive) {
            this.topbarMenuOpen.next(null);
        }
    }

    onOverlaySubmenuOpen() {
        this.overlayOpen.next(null);
    }

    showSidebar() {
        this.state.profileSidebarVisible = true;
    }

    showConfigSidebar() {
        this.state.configSidebarVisible = true;
    }

    isOverlay() {
        return this.config.menuMode === 'overlay';
    }

    isDesktop() {
        return window.innerWidth > 991;
    }

    isSlim() {
        return this.config.menuMode === 'slim';
    }

    isHorizontal() {
        return this.config.menuMode === 'horizontal';
    }

    isMobile() {
        return !this.isDesktop();
    }

    onConfigUpdate() {
        this.configUpdate.next(this.config);
    }

}
