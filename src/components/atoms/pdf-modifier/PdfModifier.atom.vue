<!--    todo COMPONENT PDF MODIFIER

    -   This is a component pdf modifier, where you can send props or data here to modify the file pdf that you need edit, this component can improve. Read the oficial documentation of pdf-lib :
    ?https://www.npmjs.com/package/pdf-lib?activeTab=readme.

    !IF YOU MUST MODIFY THIS COMPONENT, PLEASE TAKE CAUTION, THS COMPONENT MUST BE REUSABLE, DON'T DEFINE DEFAULT VALUES OR METHODS THAT JUST FOUND IN ONLY OR ESPECIFIC COMPONENT, MUST FOUND ANY COMPONENT THAT CALL HIM.

    structure propsdata 
    dataPdfModifier = reactive({
        nameFile :'',
        pages:[
          {
            images:[
                  {
                    urlImg : '',
                    posX : '',
                    posY: '',
                    type:''
                  }
            ],
            texts:[
                  value:'',
                  posX : '',
                  posY: '',
            ],
            ...
          }
        ]
  });
-->

<template>
  <div>
    <button @click="addImageToPdf">{{ t('add_image_to_pdf') }}</button>
  </div>
</template>
  
<script setup lang="ts">
//Imports
import { PDFDocument, rgb } from "pdf-lib";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
//Define props with structure json
const props = defineProps(['dataPdfModifier']);

//TODO Methods 
const addImageToPdf = async () => {//add image to pdf must be improve
  try {
    const pdfUrl = props.dataPdfModifier.urlPdf;

    const existingPdfBytes = await fetch(pdfUrl).then((res) => res.arrayBuffer());

    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    //Examples how get the page and can modify.
    const secondPage = pdfDoc.getPages()[1];
    const fourthPage = pdfDoc.getPages()[3];

    const imageUrl = props.dataPdfModifier.urlImg;
    const imageBytes = await fetch(imageUrl).then((res) => res.arrayBuffer());

    const image = await pdfDoc.embedJpg(imageBytes);
    secondPage.drawImage(image, {
      x: 50, 
      y: 200, 
      width: 100, 
      height: 100, 
    });
    
    fourthPage.drawImage(image, {
      x: 50, 
      y: 200, 
      width: 100, 
      height: 100, 
    });

    const text = "¡Texto agregado en PDF!";
    const fontSize = 12;
    const x = 50; 
    const y = 200;
    secondPage.drawText(text, {
      x,
      y,
      size: fontSize,
      color: rgb(0, 0, 0), 
    });

    
    const modifiedPdfBytes = await pdfDoc.save();

  
    const modifiedPdfBlob = new Blob([modifiedPdfBytes], { type: "application/pdf" });

    
    const downloadUrl = URL.createObjectURL(modifiedPdfBlob);

    
    const downloadLink = document.createElement("a");
    downloadLink.href = downloadUrl;
    downloadLink.download = "modified_pdf.pdf";
    downloadLink.click();

    
    URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Error al agregar la imagen al PDF:", error);
  }
};
</script>
  