import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import { z } from "zod";

const layoutConfigSchema = z.object({
    input: z.object({
        directory: z.string(),
        extensions: z.array(z.string()),
    }),
    style: z.object({
        harmonicRatio: z.number(),
        baseValue: z.string(),
        dev: z.boolean(),
    }),
    output: z.object({
        file: z.string(),
    }),
});

export type LayoutConfig = z.infer<typeof layoutConfigSchema>;

// Config par défaut
function defaultLayoutConfig(): LayoutConfig {
    return {
        input: {
            directory: ".",
            extensions: [".html"],
        },
        style: {
            harmonicRatio: 1.618,
            baseValue: "16.5px",
            dev: true,
        },
        output: {
            file: "./layout.css",
        },
    };
}

// Fonction de chargement avec fallback + création
export async function loadLayoutConfigFromJson(path = "./layoutcss.json"): Promise<LayoutConfig> {
    if (existsSync(path)) {
        try {
            const text = await readFile(path, "utf-8");
            const json = JSON.parse(text);
            const result = layoutConfigSchema.safeParse(json);

            if (!result.success) {
                console.error("❌ Invalid config format, using default config.");
                return defaultLayoutConfig();
            }

            console.log("✅ Valid config loaded.");
            return result.data;
        } catch (err) {
            console.error("❌ Error reading/parsing config file, using default config.");
            return defaultLayoutConfig();
        }
    } else {
        console.log("⚠️ Config file not found. Creating default config at", path);
        const defaultConfig = defaultLayoutConfig();
        try {
            await writeFile(path, JSON.stringify(defaultConfig, null, 2));
            console.log("✅ Default config written to", path);
        } catch (err) {
            console.error("❌ Failed to write default config file:", err);
        }
        return defaultConfig;
    }
}

