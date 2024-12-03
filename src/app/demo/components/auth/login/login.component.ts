import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Router } from '@angular/router'; // Pour rediriger après connexion
import { AuthService } from './auth.service';

@Component({
    templateUrl: './login.component.html',
})
export class LoginComponent {
    email: string = '';
    password: string = '';
    rememberMe: boolean = false;
    errorMessage: string = ''; // Pour afficher un message d'erreur si la connexion échoue

    constructor(
        private layoutService: LayoutService,
        private authService: AuthService, // Injection du service d'authentification
        private router: Router // Pour rediriger l'utilisateur après la connexion
    ) {}

    get dark(): boolean {
        return this.layoutService.config().colorScheme !== 'light';
    }

    // Méthode pour gérer la connexion
    login(): void {
        this.authService.login(this.email, this.password)
            .then(response => {
                // Si la connexion est réussie, rediriger l'utilisateur vers la page principale
                this.router.navigate(['/home']);
            })
            .catch(error => {
                // Si une erreur survient, afficher un message d'erreur
                this.errorMessage = 'Échec de la connexion. Vérifiez vos informations.';
            });
    }
}
