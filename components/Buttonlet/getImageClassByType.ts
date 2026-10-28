export default function getImageClassByType(type: string): string | null {
  switch (type) {
    case "book":
      return "fa-book";

    case "bsky":
      return "fbg-bsky";

    case "check":
      return "fa-check";

    case "chevron-down":
      return "fa-chevron-down";

    case "close":
      return "fa-close";

    case "delete":
    case "delete-contact":
      return "fa-times";

    case "edit":
      return "fa-pencil";

    case "envelope":
      return "fa-envelope";

    case "facebook":
      return "fa-facebook";

    case "frequency":
      return "fa-info";

    case "lock":
    case "padlock":
      return "fa-lock";

    case "minus":
      return "fa-minus";

    case "plan":
      return "fa-bookmark buttonlet--plan";

    case "plan--active":
      return "fa-bookmark buttonlet--active-plan";

    case "plus":
      return "fa-plus";

    case "question":
      return "fa-question";

    case "quote-left":
      return "fa-quote-left";

    case "refresh":
      return "fa-refresh";

    case "save-outfit":
      return "fl-ico fl-ico-save-outfit";

    case "star":
      return "fa-star";

    case "star-o":
      return "fa-star-o";

    case "unlock":
      return "fa-unlock";

    default:
      return null;
  }
}
