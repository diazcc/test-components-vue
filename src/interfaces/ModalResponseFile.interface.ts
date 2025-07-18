export interface ModalResponseFile {
  isFirstSection: boolean;
  howContinue: string;
  shippingMode: any;
  isActive: boolean;
  isResponse: boolean;
  modeResponse: string;
  isCreateFile: boolean;
  stateView: string;
  dataCardInformationFiling: any;
  isTrdView: boolean;
  /* dataFiling: {
    filing_code: string;
    type_of_filing: {
      id: number;
      code: string;
      name: string;
      delete: boolean;
    };
    filing_date: string;
    filing_time: string;
    subject: string;
    description: string;
    presentation_mode: {
      id: number;
      code: string;
      label: string;
    };
    remitter: {
      id: number;
      email: string;
      contact_name: string | null;
      address: string;
      person_type: {
        id: number;
        code: string;
        label: string;
      };
    };
    addressee: any;
    creation_medium: string;
    filing_qr: string;
    filing_certificate: string;
    filing_sticker: string;
    documents: Array<{
      name: string;
      url: string;
    }>;
    relationship_matrix_documentary_type: any;
  }; */
  dataSelectListActionUsers: {
    typeOfFinalAction: string;
    stateEditorText: boolean;
    usersSelecteds: any[];
    users: any[];
  };
  dataDocumentCreator: any;
  dataFormTrd: any;
  assign :any;
  dataResumeFiling: any;
  dataButtonBack: {
    className: string;
    text: string;
    alt: string;
    url: string;
    disabled: boolean;
    reverse: boolean;
    fontSize: string;
    iconSize: string;
    onClick: () => void;
  };
  dataButtonContinue: {
    className: string;
    text: string;
    alt: string;
    url: string;
    disabled: boolean;
    reverse: boolean;
    fontSize: string;
    iconSize: string;
    onClick: () => void;
  };
  openFile: (index: any) => void;
}
/* 

 "response": {
        "id": 131,
        "status": {
            "label": "in_process",
            "code": "IN_PROCESS"
        },
        "assigned_user": {
            "id": 15,
            "full_name": "Andres felipe Diaz castillo",
            "email": "andresdiaz212629@gmail.com",
            "dependence": {
                "code": 1,
                "name": "PRUEBA",
                "state": true,
                "parent_dependency": null,
                "delete": false
            }
        },
        "filings": [
            {
                "filing_code": "112025000018",
                "type_of_filing": {
                    "id": 1,
                    "code": "1",
                    "name": "Entrada",
                    "delete": false
                },
                "filing_date": "2025-06-04",
                "filing_time": "16:16:59",
                "subject": "prueba",
                "description": "",
                "presentation_mode": {
                    "id": 1,
                    "code": "001",
                    "label": "written"
                },
                "remitter": {
                    "id": 1,
                    "email": "louppautrumabo-1392@yopmail.com",
                    "contact_name": null,
                    "address": "calle  11  53",
                    "person_type": {
                        "id": 1,
                        "code": "001",
                        "label": "person"
                    }
                },
                "addressee": null,
                "creation_medium": "window_filing",
                "filing_qr": "auth/records_and_folders/2025EXP000133/112025000018/qr-112025000018.png",
                "filing_certificate": "auth/records_and_folders/2025EXP000133/112025000018/certificado_radicación-112025000018.pdf",
                "filing_sticker": "auth/records_and_folders/2025EXP000133/112025000018/sticker-112025000018.pdf",
                "documents": [
                    {
                        "name": "Docugate BPM Mokcups-112025000018 - 1-Entrada.pdf",
                        "url": "auth/records_and_folders/2025EXP000133/112025000018/documents/Docugate BPM Mokcups-112025000018 - 1-Entrada.pdf"
                    }
                ],
                "relationship_matrix_documentary_type": null
            }
        ],
        "status_display": {
            "label": "in_process",
            "code": "IN_PROCESS"
        },
        "user_actions": [
            "assign_user_record",
            "record_response_filing"
        ],
        "documents": {
            "record": [],
            "filings": [
                {
                    "id": 133,
                    "name": "Docugate BPM Mokcups-112025000018 - 1-Entrada.pdf",
                    "document": "auth/records_and_folders/2025EXP000133/112025000018/documents/Docugate BPM Mokcups-112025000018 - 1-Entrada.pdf",
                    "page_number": 0,
                    "filing": "112025000018"
                }
            ]
        }
    }


 */
