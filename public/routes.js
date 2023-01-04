import {HomePage} from './views/home-page.jsx'
import {AboutUs} from './views/about-us.jsx'
import {BugIndex} from './views/bug-index.jsx'
import {BugDetails} from './views/bug-details.jsx'
import {BugEdit} from './views/bug-edit-cmp.jsx'
import { LoginForm } from './cmps/login-form.jsx'
import { LoginSignUp } from './cmps/login-signup.jsx'


export default [
    {
        path:'/',
        component: HomePage,
    },
    {
        path:'/bug',
        component: BugIndex,
    },
    {
        path:'/bug/:bugId',
        component: BugDetails,
    },
    {
        path:'/about',
        component: AboutUs,
    },
    {
        path:'bug/edit/:bugId',
        component: BugEdit,
    },
    {
        path: '/api/auth/signup',
        component: BugEdit,
    },
    {
        path: '/api/auth/login',
        component: LoginForm,
    },
        // {
        //     path: '/api/auth/logout',
        //     component: BugEdit,
        // }

]