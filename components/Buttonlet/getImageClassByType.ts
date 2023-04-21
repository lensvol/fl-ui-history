export default function getImageClassByType(type: string): string | null {
  switch (type) {
    case "edit":
      return "fa-pencil";
    case "delete":
    case "delete-contact":
      return "fa-times";
    case "plan":
      return "fa-bookmark buttonlet--plan";
    case "plan--active":
      return "fa-bookmark buttonlet--active-plan";
    case "refresh":
      return "fa-refresh";
    case "close":
      return "fa-close";
    case "question":
      return "fa-question";
    case "frequency":
      return "fa-info";
    case "check":
      return "fa-check";
    case "book":
      return "fa-book";
    case "facebook":
      return "fa-facebook";
    case "twitter":
      return "fa-twitter";
    case "lock":
    case "padlock":
      return "fa-lock";
    case "quote-left":
      return "fa-quote-left";
    case "save-outfit":
      return "fl-ico fl-ico-save-outfit";
    case "unlock":
      return "fa-unlock";
    case "plus":
      return "fa-plus";
    case "minus":
      return "fa-minus";
    case "envelope":
      return "fa-envelope";
    default:
      return null;
  }
}
