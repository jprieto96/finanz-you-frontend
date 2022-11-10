import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue')
    },
    {
        path: '/register',
        name: 'NewClient',
        component: () => import('../views/clients/NewClient.vue')
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/clients/ClientLogin.vue')
    },
    {
        path: '/client',
        name: 'ClientHome',
        component: () => import('../views/clients/ClientHome.vue')
    },
    {
        path: '/client/logout',
        name: 'Logout',
        component: () => import('../views/clients/ClientLogOut')
    },
    {
        path: '/client/portfolio',
        name: 'ShowPortfolio',
        component: () => import('../views/clients/ShowPortfolio.vue')
    },
    {
        path: '/client/transactions',
        name: 'ShowTransactions',
        component: () => import('../views/clients/ShowTransactions.vue')
    },
    {
        path: '/stock/:id',
        name: 'Stock',
        component: () => import('../views/stocks/Stock.vue')
    },
    {
        path: '/client/perfil',
        name: 'Perfil',
        component: () => import('../views/clients/ClientProfile.vue')
    },
    {   //Este componente NotFound siempre tiene que ir el ultimo en routes
        path: '/*',
        name: 'NotFound',
        component: () => import('../views/NotFound.vue')
    }
]

const router = new VueRouter({
    mode: 'history',
    routes
})

export default router