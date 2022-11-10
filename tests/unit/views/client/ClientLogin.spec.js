import {createLocalVue, mount, shallowMount} from '@vue/test-utils'
import UserLogin from "@/views/clients/ClientLogin";
import BootstrapVue from 'bootstrap-vue'

const localVue = createLocalVue();
localVue.use(BootstrapVue);

describe('Elementos HTML de la vista de login usuario', () => {

    const $cookies = {
        get: function () {
            return undefined
        }
    };
    let wrapper = mount(UserLogin, {
        localVue,
        mocks: {
            $cookies
        }
    });

    it('Validación del título de la página', async () => {
        expect(wrapper.find('#title').text()).toEqual("Login")
    })

    it('Validación del formulario', async  () => {
        expect(wrapper.find('#input-group-user').text()).toEqual("Usuario:")
        let passwd = wrapper.find('#input-group-password')
        expect(passwd.text()).toEqual("Contraseña:min. 8 caracteres, al menos 1 letra y 1 número")
        expect(passwd.find('#input-password').props().type).toEqual('password')
        expect(wrapper.find('#input-group-user').text()).toEqual("Usuario:")
    })

    it('Validacion botones', async () => {
        expect(wrapper.find('.button-success-login').isVisible()).toEqual(true)
        expect(wrapper.find('.button-cancel-login').isVisible()).toEqual(true)
    })
})

describe('Prueba redirección', () => {

    const $cookies = {
        get: function () {
            return 'easter egg'
        }
    };
    let wrapper = mount(UserLogin, {
        localVue,
        mocks: {
            $cookies
        }
    });

    it('Si estamos logeados no mostramos formulario de login', async () => {
        expect(wrapper.html()).toEqual('')
    })
})