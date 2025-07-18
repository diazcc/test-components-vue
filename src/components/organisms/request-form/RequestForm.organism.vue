<template>
 <section class="request-form">
    <p class="request-form__subtitle">{{ t('please_select_response_type') }}</p>
    <ol class="request-form__container">
        <nav>
            <input type="text" :placeholder="t('subject')" class="request-form__container__input-file input--form">
            <select class="input input--form" >
                <option value="" selected disabled>{{t('select_type_response')}}</option>
                <option value="001" selected disabled>{{t('upload_file')}}</option>
                <option value="002" selected disabled>{{t('create_one')}}</option>
            </select>
        </nav>
        <input type="file" class="request-form__container__input-file">
        <EditorText  :data-editor-text="data"/>
    </ol>
 </section>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import EditorText from '../../molecules/editor-text/EditorText.molecule.vue';
import { reactive } from 'vue';
const { t, te } = useI18n();

const data :any = reactive( {
        dataEditor: { 
            setData: () => { },
            content: '',
        },
    })
</script>
<style scoped src="./RequestForm.organism.scss"></style>