# إنشاء APK من خلال GitHub Actions

تم إنشاء workflow تلقائي لبناء وتوقيع APK من تطبيقك باستخدام GitHub Actions.

## كيفية الاستخدام

### 1. إضافة مفاتيح التوقيع (Signing Keys)

يجب إنشاء keystore لتوقيع التطبيق:

```bash
keytool -genkey -v -keystore release.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias l-wesmo-key
```

### 2. تحويل الـ keystore إلى Base64

```bash
base64 release.keystore | tr -d '\n' > keystore_base64.txt
```

### 3. إضافة Secrets إلى GitHub

اذهب إلى إعدادات المستودع:
- **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

أضف المتغيرات التالية:

| الاسم | الوصف |
|------|------|
| `ANDROID_SIGNING_KEY` | محتوى الـ Base64 من keystore |
| `ANDROID_KEY_ALIAS` | اسم الـ key alias المستخدم (مثل: `l-wesmo-key`) |
| `ANDROID_KEYSTORE_PASSWORD` | كلمة المرور للـ keystore |
| `ANDROID_KEY_PASSWORD` | كلمة المرور للـ key |

### 4. تفعيل الـ Workflow

يتم تفعيل الـ workflow تلقائياً في الحالات التالية:

- **Push إلى main أو develop**
- **إنشاء pull request**
- **إنشاء tag جديد** (مثل: `v1.0.0`)
- **تشغيل يدوي** من خلال GitHub Actions

### 5. تحميل APK

بعد انتهاء البناء:
- يمكن تحميل APK من **Actions Artifacts**
- إذا تم إنشاء tag، سيتم رفع APK تلقائياً إلى Release

## البدائل

### استخدام EAS Build (Expo)

إذا كنت تفضل استخدام EAS Build:

```bash
npm install -g eas-cli
eas build --platform android
```

يتطلب:
- حساب Expo مجاني
- `EXPO_TOKEN` في GitHub Secrets

### بناء محلي

```bash
npm run prebuild
cd android
./gradlew assembleRelease
```

## المتطلبات

- Node.js 18+
- Java 17+
- Android Build Tools 34.0.0

الـ workflow يتولى تثبيت كل هذه المتطلبات تلقائياً.
