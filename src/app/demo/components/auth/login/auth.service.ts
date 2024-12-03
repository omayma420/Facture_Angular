import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Pour effectuer des requêtes HTTP
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:1337';  // URL de votre backend Strapi

  constructor(private http: HttpClient, private router: Router) {}

  // Méthode pour se connecter
  login(email: string, password: string): Promise<any> {
    return this.http
      .post(`${this.apiUrl}/auth/local`, { identifier: email, password: password })
      .toPromise()
      .then((response: any) => {
        // Afficher un message dans la console en cas de succès
        console.log('Authentification réussie:', response);

        // Sauvegarder le token JWT dans le stockage local
        localStorage.setItem('jwt', response.jwt);
        return response;
      })
      .catch((error) => {
        // Afficher un message d'erreur dans la console en cas d'échec
        console.error('Erreur d\'authentification:', error);
        if (error.status === 400) {
          console.error('Identifiants incorrects');
        } else {
          console.error('Erreur inconnue lors de la tentative de connexion');
        }
        throw error;
      });
  }

  // Méthode pour vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    const isAuth = !!localStorage.getItem('jwt');
    console.log('Utilisateur authentifié:', isAuth);
    return isAuth;
  }

  // Méthode pour se déconnecter
  logout(): void {
    console.log('Déconnexion en cours...');
    localStorage.removeItem('jwt');
    this.router.navigate(['/login']);
  }

  // Méthode pour obtenir le token actuel
  getToken(): string | null {
    const token = localStorage.getItem('jwt');
    console.log('Token actuel:', token);
    return token;
  }
}
