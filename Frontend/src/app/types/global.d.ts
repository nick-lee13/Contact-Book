export {}

declare global {
  interface Contact {
    id: string
    fName: string
    lName: string
    email: string
    phone: string
    imageUrl?: string
    [key: string]: string;
  }
}