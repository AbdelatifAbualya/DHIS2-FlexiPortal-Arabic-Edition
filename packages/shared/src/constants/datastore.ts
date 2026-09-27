import {
    AppAppearanceConfig,
    AppMenuConfig,
    ContentTranslationsConfig,
    MetadataConfig,
} from '../schemas'

export enum DatastoreNamespaces {
    MODULES = 'hisptz-public-portal-modules',
    MAIN_CONFIG = 'hisptz-public-portal',
    DATA_SERVICE_CONFIG = 'hisptz-public-data-service-config',
}

export enum DatastoreKeys {
    APPEARANCE = 'appearance',
    METADATA = 'metadata',
    MENU = 'menu',
    TRANSLATIONS = 'translations',
}

export type DatastoreConfig<T extends DatastoreKeys = DatastoreKeys> =
    T extends DatastoreKeys.METADATA
        ? MetadataConfig
        : T extends DatastoreKeys.MENU
          ? AppMenuConfig
          : T extends DatastoreKeys.APPEARANCE
            ? AppAppearanceConfig
            : T extends DatastoreKeys.TRANSLATIONS
              ? ContentTranslationsConfig
              : never
