import {createLocalVue, mount} from '@vue/test-utils'
import Footer from "@/components/Footer";

import BootstrapVue from 'bootstrap-vue'

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const wrapper = mount(Footer, {
    localVue
});

describe('Pruebas unitarias del componente Footer', () => {

    it('Validación de los elementos del Footer', async () => {
        expect(wrapper.find('.footer').find('section').text()).toEqual("© 2021 Copyright")
        expect(wrapper.find('.footer').find('a').text()).toEqual("TFG")
    })
})