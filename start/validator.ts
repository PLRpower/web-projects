import vine, {SimpleMessagesProvider} from "@vinejs/vine";

const messages = {
  'required': 'est requis',
  'string': 'doit être une chaîne de caractères.',
  'email': "n'est pas valide.",
  'minLength': "doit contenir au moins {{ min }} caractères.",
  'maxLength': "doit contenir au maximum {{ max }} caractères.",
  'confirmed': "et la confirmation ne correspondent pas.",
  'alreadyBeenTaken': "a déjà été pris.",
}

const fields = {
  password: 'mot de passe',
  email: 'adresse email',
}

vine.messagesProvider = new SimpleMessagesProvider(messages, fields)
