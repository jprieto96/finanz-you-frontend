import { createLocalVue, mount } from '@vue/test-utils'
import Home from "@/views/clients/NewClient";
import BootstrapVue from 'bootstrap-vue'

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const wrapper = mount(Home, {
    localVue
});

describe('Elementos HTML de la vista alta cliente', () => {

    it('Validación del título de la página', async () => {
        expect(wrapper.find('#title').text()).toEqual("Formulario de Registro")
    })

    it('Validación del formulario', async  () => {
        expect(wrapper.find('#input-group-user').text()).toEqual("Usuario:")
        let passwd = wrapper.find('#input-group-password')
        expect(passwd.text()).toEqual("Contraseña:min. 8 caracteres, al menos 1 letra y 1 número")
        expect(passwd.find('#input-password').props().type).toEqual('password')
        expect(wrapper.find('#input-group-dni').text()).toEqual("DNI:")
    })

    it('Validacion botones', async () => {
        expect(wrapper.find('.button-success').isVisible()).toEqual(true)
        expect(wrapper.find('.button-cancel').isVisible()).toEqual(true)
    })
})
