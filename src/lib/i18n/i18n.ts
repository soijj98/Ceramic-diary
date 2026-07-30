import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";

//{i18n.t("")}

const translations = {

    fi: {
        loginTitle: "Kirjaudu sisään",
        signupTitle: "Luo tunnus",
        emailPlaceholder: "Sähköposti",
        passwordPlaceholder: "Salasana",
        loginButton: "Kirjaudu",
        signupButton: "Rekisteröidy",
        noAccountYet: "Ei vielä tiliä? Rekisteröidy tähän",
        hasAccountAlready: "Onko sinulla jo tili? Kirjaudu sisään",
        fillAllFields: "Täytä kaikki kentät.",
        error: "Virhe",
    },

    en: {
        loginTitle: "Log In",
        signupTitle: "Sign Up",
        emailPlaceholder: "Email",
        passwordPlaceholder: "Password",
        loginButton: "Log In",
        signupButton: "Sign Up",
        noAccountYet: "Don't have an account? Sign up here",
        hasAccountAlready: "Already have an account? Log in",
        fillAllFields: "Please fill in all fields.",
        error: "Error",
    }
}; 

const i18n = new I18n(translations);

// Phone's language if it can be find (otherwise using finnish or english)
const deviceLanguage = getLocales()[0]?.languageCode ?? "fi";
i18n.locale = deviceLanguage;

// Jos halutaan sallia myös puuttuvien käännösten näyttäminen oletuskielenä:
// if want allow to be show missing translates
i18n.enableFallback = true;
i18n.defaultLocale = "fi";

export default i18n;