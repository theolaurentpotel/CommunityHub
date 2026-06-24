import { describe, test, expect, beforeEach } from 'vitest';
import authReducer, { logout, loginUser } from './authSlice';  // les outils que l'on va tester
/*
Pour lancer les tests : 
npm run test

Outils de test : 
import { describe, test, expect } from 'vitest';

describe : Permet de regrouper plusieurs tests
test : définit un test unitaire. Alias possible : it
expect : permet de vérifier le résultat attendu
beforeEach : exécute du code avant chaque test

Autres outils disponibles :
afterEach : exécute du code après chaque test
beforeAll : exécute du code une seule fois avant les tests
afterAll : exécute du code une seule fois après les tests
...

Résultats :
toBe : comparaison stricte
toEqual : compare deux objets ou tableaux
toBeNull : la valeur doit être null
toBeTrusthy : la valeur doit être true
toBeFalsy : la valeur doit être false
toContain : doit contenir une valeur dans un tableau ou dans une chaine
...

Les outils React Testing library :
render : Afficher un component
screen : Permet de rechercher des éléments 
userEvent : Simule un comportement utilisateur
                await user.click(button)
...
*/

describe('authSlice', () => {

    beforeEach(() => { // avant chaque test
        localStorage.clear() // on vide le storage
    })

    // on test logout
    test('logout vide le user, le token le status et une erreur potentielle', () => {
        const initialState = { // on crée un faux état redux
            user: { id: 1, username: 'admin', role: 'admin'},
            token: '123456',
            status: 'success',
            error: 'Erreur 123',
        }

        const newState = authReducer(initialState, logout())
        // newState contient le résultat

        expect(newState.user).toBeNull() // null
        expect(newState.token).toBeNull() // null
        expect(newState.error).toBeNull() // anciennes erreurs potentielles supprimées
        expect(newState.status).toBe('waiting') // status initial défini dans le authSlice
    })

    // connexion réussie, Redux stocke les informations du user
    test('Connexion utilisateur', () => {        
        const initialState = {
            user: null,
            token: null,
            status: 'waiting',
            error: null,
        } // pas de user connecté

        const user = {
            id: 1,
            username: 'admin',
            role: 'admin',
            accessToken: 'abcdef',
        } // user fictif

        const action = {
            type: loginUser.fulfilled.type, // type: ce qu'il s'est passée
            payload: user,
        } // action redux (loginUser.fulfilled = connexion réussie)

        const newState = authReducer(initialState, action)
        // initialState : état actuel
        // action : ce qu'il vient de se passer

        expect(newState.status).toBe('success') // connexion réussie le status doit être success
        expect(newState.user).toEqual(user) // les données utilisateur doivent être stockées
        expect(newState.token).toEqual('abcdef') // le token

    })

})