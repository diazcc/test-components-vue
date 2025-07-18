<template>
    <article class="ask-docugate-template">
        <nav class="ask-docugate-template__go-back-navbar">
            <Img :dataImg="dataAskDocugate.dataImgGoBack"/>
        </nav>
        <article class="ask-docugate-template__chat-window">
            <section class="ask-docugate-template__chat-window__text-container">
                <div
                    class="ask-docugate-template__chat-window__text-container__conversation">
                    <div v-if="dataAskDocugate.data.length === 0"
                        class="ask-docugate-template__chat-window__text-container__conversation__message-container ask-docugate-template__chat-window__text-container__conversation__message-container--zero">
                        <h1 v-if="!dataAskDocugate.usserLoad">{{ t("hello") }}, {{ dataAskDocugate.user }}</h1>
                        <h1 v-else class="loading-component">{{ t("loading") }}</h1>
                    </div>
                    <div v-else 
                        class="ask-docugate-template__chat-window__text-container__conversation__message-container">
                        <ul v-for="message in dataAskDocugate.data" class="ask-docugate-template__chat-window__text-container__conversation__message-container__box">
                            <li class="ask-docugate-template__chat-window__text-container__conversation__message-container__box__question"
                                v-html=message.question>
                            </li>
                            <li v-if="!message.isResponseLoading" class="ask-docugate-template__chat-window__text-container__conversation__message-container__box__answer">
                                <div class="ask-docugate-template__chat-window__text-container__conversation__message-container__box__answer__icon">
                                    <Img :dataImg="dataAskDocugate.dataImgLoading"/>
                                </div>
                                <p v-html="message.answer" class="markdown-text"></p>
                            </li>
                            <li v-else class="ask-docugate-template__chat-window__text-container__conversation__message-container__box__answer">
                                <div class="ask-docugate-template__chat-window__text-container__conversation__message-container__box__answer__icon ask-docugate-template__chat-window__text-container__conversation__message-container__box__answer__icon--loader">
                                    <div class="spinner"></div>
                                    <Img :dataImg="dataAskDocugate.dataImgLoading"/>
                                </div>
                                <p class="ask-docugate-template__chat-window__text-container__conversation__message-container__box__answer__text loading-component">{{ `${t("one_moment")}...` }}</p>
                                <p v-for="_ in 4" class="loading-component"></p>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
            <footer class="ask-docugate-template__chat-window__input-container">
                <div class="ask-docugate-template__chat-window__input-container__input-area" :style="{ height: dataAskDocugate.textareaHeight + 'px' }">
                    <textarea id="text-area" class="ask-docugate-template__chat-window__input-container__input-area__input"
                        :placeholder="t('ask_docugate')+'...'" v-model="dataAskDocugate.question"
                        @input="adjustHeight" @keydown="handleKeydown" rows="1">
                    </textarea>
                    <nav class="ask-docugate-template__chat-window__input-container__input-area__nav">
                        <div class="ask-docugate-template__chat-window__input-container__input-area__nav__item">
    
                        </div>
                        <div class="ask-docugate-template__chat-window__input-container__input-area__nav__item">
                            <div class="ask-docugate-template__chat-window__input-container__input-area__nav__item__icon-container">
                                <Img :dataImg="dataAskDocugate.dataImgSummit"/>
                                <span class="tooltip"> {{ `${t("send")} ${t("message")}` }}</span>
                            </div>
                        </div>
                    </nav>
                </div>
            </footer>
        </article>
    </article>
</template>
    
<script setup lang="ts">
    
    import { onMounted, reactive, ref } from 'vue';
    import { useI18n } from 'vue-i18n'; 
    import { marked } from 'marked';
    
    import Img from '../../atoms/img/Img.atom.vue';
    
    import FormValidators from '../../../validators/FormValidators';
    import UtilsServices from '../../../services/UtilsServices';
    import UserService from '../../../services/UserServices';
    import axios from 'axios';
    import { error } from 'pdf-lib';
    
    
    const { t } = useI18n();
    const dataAskDocugate: any = reactive(setDataAskDocugate());
    const emit = defineEmits(['emitCloseAskDocugate']);
    
    onMounted(() => {
        getLoggedUser();
    })
    
    function setDataAskDocugate() {
        return {
            question: "",
            textareaHeight: 5,
            user: "",
            usserLoad: true,
            isResponseLoading: false,
            data: [],
            dataImgGoBack: {
                id: '',
                name: 'back',
                class: 'icon-back',
                src: '/arrow-left.svg',
                type: 'svg',
                alt: '',
                isActive: () => { }, // optional, currently used to add activate and deactivate the active class
                onClick: () => {
                    emitClosAskDocugate();
                }
            },
            dataImgSummit: {
                id: '',
                name: 'back',
                class: 'round-button',
                src: '/Buttons/icon-send.svg',
                type: 'svg',
                alt: '',
                isActive: () => { }, // optional, currently used to add activate and deactivate the active class
                onClick: () => {
                    summitQuestion();
                }
            },
            dataImgLoading: {
                id: '',
                name: 'back',
                class: 'all-space',
                src: '/Buttons/icon-loading-docugate.svg',
                type: 'svg',
                alt: '',
                isActive: () => { }, // optional, currently used to add activate and deactivate the active class
                onClick: () => {
    
                }
            }
        }
    }
    
    const adjustHeight = (event: any) => {
        dataAskDocugate.textareaHeight = UtilsServices.adjustHeight(event.target, 400);
    };
    
    function emitClosAskDocugate() {
        emit('emitCloseAskDocugate');
    };
    
    function getLoggedUser() {
        UserService.getMe()
            .then(async (response) => {
                dataAskDocugate.usserLoad = false;
                dataAskDocugate.user = `${response?.first_name || ""} ${response?.last_name || ""}`
            })
            .catch((error : any) => {
                console.error(error);
            });
    };
    
    async function createMessage(question: string) {
        let ans = {
            question: question,
            answer: "",
            isResponseLoading: true
        };
    
        // dont use temporal message
        dataAskDocugate.data.push(ans);
        dataAskDocugate.question = "";
        await axios.post("https://ml-generativo.docugateai.com/api/generative-ai/", { question })
            .then(async (response: any) => {
                dataAskDocugate.data[dataAskDocugate.data.length - 1].answer = await marked(response.data.answer);
            })
            .catch(async (error: any) => {
                console.error(error)
                dataAskDocugate.data[dataAskDocugate.data.length - 1].answer = await marked("Lo siento, hubo un error al obtener la respuesta.");  // temporal answer message
            });
        return ans;
    }
    
    
    async function summitQuestion() {
        dataAskDocugate.question = FormValidators.stripText(dataAskDocugate.question);
        if(!dataAskDocugate.isResponseLoading && dataAskDocugate.question !== ''){
            dataAskDocugate.isResponseLoading = true;
            await createMessage(dataAskDocugate.question);
            dataAskDocugate.data[dataAskDocugate.data.length - 1].isResponseLoading = false;
            dataAskDocugate.isResponseLoading = false;
            startTypingEffect();
        }
        dataAskDocugate.textareaHeight = UtilsServices.adjustHeight(document.querySelector(`#text-area`), 400, 32);
    };
    
    function startTypingEffect() {
        let message: any = dataAskDocugate.data[dataAskDocugate.data.length - 1].answer
        UtilsServices.startTypingEffect(message, dataAskDocugate.data[dataAskDocugate.data.length - 1], 5, 'ask-docugate-template__chat-window__text-container');
    };
    
    const handleKeydown = (event: KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            summitQuestion();
            event.preventDefault(); // Evitar el salto de lÃ­nea
        }
    };
    
</script>
    
<style scoped src="./AskDocugate.organism.scss"></style>