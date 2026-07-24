flutter {
    source = lib
}

android {
    namespace = "com.recuerdosdepapel.admin"
    compileSdkVersion = 34
    
    defaultConfig {
        applicationId = "com.recuerdosdepapel.admin"
        minSdkVersion = 21
        targetSdkVersion = 34
        versionCode = 1
        versionName = "1.0.0"
    }
    
    signingConfigs {
        release {
            storeFile file("../keystore.jks")
            storePassword "android"
            keyAlias "android"
            keyPassword "android"
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
        }
    }
}

flutter {
    source = lib
}