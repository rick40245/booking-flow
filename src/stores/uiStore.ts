import { defineStore } from 'pinia'

export interface FormErrors {
  [key: string]: string
}

export const useUiStore = defineStore('ui', {
  state: () => ({
    currentStep: 1,
    isLoading: false,
    formErrors: {} as FormErrors,
    modalOpen: false,
    modalContent: null as any
  }),
  actions: {
    setStep(step: number) {
      this.currentStep = step
    },
    setLoading(status: boolean) {
      this.isLoading = status
    },
    setFormError(field: string, error: string) {
      this.formErrors[field] = error
    },
    clearFormErrors() {
      this.formErrors = {}
    },
    openModal(content: any) {
      this.modalContent = content
      this.modalOpen = true
    },
    closeModal() {
      this.modalOpen = false
      this.modalContent = null
    }
  },
  persist: true
}) 