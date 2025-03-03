import React, { useState, useCallback } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import CodeBlock from "@theme/CodeBlock";
import Heading from "@theme/Heading";
import { useColorMode } from "@docusaurus/theme-common";

// Define strict literal types
type Platform = "AMD SEV" | "Intel TDX";
type Track =
  | "Social AI Agents"
  | "RAG Knowledge"
  | "AI x DeFi (DeFAI)"
  | "Consensus Learning";
type EnvVar = { name: string; value: string };

// Define the form state type
interface FormState {
  instanceName: string;
  platform: Platform;
  track: Track;
  zone: string;
  machineType: string;
  imageReference: string;
  envVars: EnvVar[];
}

export default function ConfidentialVMBuilder(): JSX.Element {
  const docusaurusContext = useDocusaurusContext();
  const { colorMode } = useColorMode();
  const isDarkTheme = colorMode === "dark";

  const [isExpanded, setIsExpanded] = useState(true);
  const [isCommandExpanded, setIsCommandExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  // Track-specific data mappings
  const trackZoneMap: Record<Track, string> = {
    "Social AI Agents": "us-central1-c",
    "RAG Knowledge": "us-east5-b",
    "AI x DeFi (DeFAI)": "us-west1-b",
    "Consensus Learning": "us-south1-a",
  };

  const trackDefaultEnvVars: Record<Track, EnvVar[]> = {
    "Social AI Agents": [
      { name: "GEMINI_API_KEY", value: "$GEMINI_API_KEY" },
      { name: "TUNED_MODEL_NAME", value: "$TUNED_MODEL_NAME" },
    ],
    "RAG Knowledge": [
      { name: "GEMINI_API_KEY", value: "$GEMINI_API_KEY" },
      { name: "TUNED_MODEL_NAME", value: "$TUNED_MODEL_NAME" },
    ],
    "AI x DeFi (DeFAI)": [
      { name: "GEMINI_API_KEY", value: "$GEMINI_API_KEY" },
      { name: "GEMINI_MODEL", value: "$GEMINI_MODEL" },
      { name: "WEB3_PROVIDER_URL", value: "$WEB3_PROVIDER_URL" },
      { name: "SIMULATE_ATTESTATION", value: "false" },
    ],
    "Consensus Learning": [
      { name: "OPEN_ROUTER_API_KEY", value: "$OPEN_ROUTER_API_KEY" },
    ],
  };

  // Platform-specific configurations
  const platformConfigs: Record<
    Platform,
    {
      machineType: string;
      cpuPlatform: string;
      maintenancePolicy: string;
      image: string;
      diskType: string;
      computeType: string;
    }
  > = {
    "AMD SEV": {
      machineType: "n2d-standard-2",
      cpuPlatform: '--min-cpu-platform="AMD Milan"',
      maintenancePolicy: "--maintenance-policy=MIGRATE",
      image:
        "projects/confidential-space-images/global/images/confidential-space-debug-250100",
      diskType: "pd-standard",
      computeType: "--confidential-compute-type=SEV",
    },
    "Intel TDX": {
      machineType: "c3-standard-4",
      cpuPlatform: "",
      maintenancePolicy: "--maintenance-policy=TERMINATE",
      image:
        "projects/confidential-space-images/global/images/confidential-space-debug-0-tdxpreview-c38b622",
      diskType: "pd-balanced",
      computeType: "--confidential-compute-type=TDX",
    },
  };

  // Initialize form state
  const [formState, setFormState] = useState<FormState>({
    instanceName: "$INSTANCE_NAME", // Using the environment variable from .env
    platform: "AMD SEV",
    track: "Social AI Agents",
    zone: trackZoneMap["Social AI Agents"],
    machineType: platformConfigs["AMD SEV"].machineType,
    imageReference: "$TEE_IMAGE_REFERENCE", // Using the environment variable from .env
    envVars: [...trackDefaultEnvVars["Social AI Agents"]],
  });

  // Handler for track changes - creates a brand new state object
  const handleTrackChange = (track: Track) => {
    setFormState({
      ...formState,
      track,
      zone: trackZoneMap[track],
      envVars: [...trackDefaultEnvVars[track]],
    });
  };

  // Handler for platform changes - creates a brand new state object
  const handlePlatformChange = (platform: Platform) => {
    setFormState({
      ...formState,
      platform,
      machineType: platformConfigs[platform].machineType,
    });
  };

  // Handle all form changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    // Handle track selection
    if (
      name === "track" &&
      (value === "Social AI Agents" ||
        value === "RAG Knowledge" ||
        value === "AI x DeFi (DeFAI)" ||
        value === "Consensus Learning")
    ) {
      handleTrackChange(value);
      return;
    }

    // Handle platform selection
    if (name === "platform" && (value === "AMD SEV" || value === "Intel TDX")) {
      handlePlatformChange(value);
      return;
    }

    // Handle checkbox
    if (type === "checkbox") {
      setFormState({
        ...formState,
        includeComment: (e.target as HTMLInputElement).checked,
      });
      return;
    }

    // Handle text inputs
    if (
      name === "instanceName" ||
      name === "imageReference" ||
      name === "machineType"
    ) {
      setFormState({
        ...formState,
        [name]: value,
      });
    }
  };

  // Handle environment variable changes
  const handleEnvVarChange = (
    index: number,
    field: "name" | "value",
    value: string,
  ) => {
    const newEnvVars = [...formState.envVars];
    newEnvVars[index] = {
      ...newEnvVars[index],
      [field]: value,
    };

    setFormState({
      ...formState,
      envVars: newEnvVars,
    });
  };

  // Add a new environment variable
  const addEnvVar = () => {
    setFormState({
      ...formState,
      envVars: [...formState.envVars, { name: "", value: "" }],
    });
  };

  // Remove an environment variable
  const removeEnvVar = (index: number) => {
    const newEnvVars = [...formState.envVars];
    newEnvVars.splice(index, 1);

    setFormState({
      ...formState,
      envVars: newEnvVars,
    });
  };

  // Build the command string
  const buildCommand = () => {
    const {
      instanceName,
      platform,
      zone,
      envVars,
      imageReference,
      machineType,
    } = formState;

    const config = platformConfigs[platform];

    // Format environment variables for metadata
    let metadataString = `tee-image-reference=${imageReference}`;

    // Add container log redirect
    metadataString += ",tee-container-log-redirect=true";

    // Add env variables if they exist
    const filteredEnvVars = envVars.filter((v) => v.name && v.value);
    if (filteredEnvVars.length > 0) {
      filteredEnvVars.forEach((envVar) => {
        metadataString += `,tee-env-${envVar.name}=${envVar.value}`;
      });
    }

    const commandArray = [
      `gcloud compute instances create ${instanceName} \\`,
      `  --project=verifiable-ai-hackathon \\`,
      `  --zone=${zone} \\`,
      `  --machine-type=${machineType} \\`,
      `  --network-interface=network-tier=PREMIUM,nic-type=GVNIC,stack-type=IPV4_ONLY,subnet=default \\`,
      `  --metadata=${metadataString} \\`,
      `  ${config.maintenancePolicy} \\`,
      `  --provisioning-model=STANDARD \\`,
      `  --service-account=confidential-sa@verifiable-ai-hackathon.iam.gserviceaccount.com \\`,
      `  --scopes=https://www.googleapis.com/auth/cloud-platform \\`,
    ];

    // Add CPU platform for AMD Milan (Intel TDX doesn't need it)
    if (config.cpuPlatform) {
      commandArray.push(`  ${config.cpuPlatform} \\`);
    }

    commandArray.push(
      `  --tags=flare-ai,http-server,https-server \\`,
      `  --create-disk=auto-delete=yes,\\`,
      `boot=yes,\\`,
      `device-name=${instanceName},\\`,
      `image=${config.image},\\`,
      `mode=rw,\\`,
      `size=11,\\`,
      `type=${config.diskType} \\`,
      `  --shielded-secure-boot \\`,
      `  --shielded-vtpm \\`,
      `  --shielded-integrity-monitoring \\`,
      `  --reservation-affinity=any \\`,
      `  ${config.computeType}`,
    );

    return commandArray.join("\n");
  };

  // Copy command to clipboard
  const copyToClipboard = useCallback(() => {
    navigator.clipboard
      .writeText(buildCommand())
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => console.error("Could not copy text: ", err));
  }, [formState]);

  const command = buildCommand();

  // Custom styles for light/dark mode
  const containerStyle = {
    backgroundColor: isDarkTheme ? "#1a1a1a" : "#fff1f3",
    borderRadius: "8px",
    marginBottom: "20px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  };

  const headerStyle = {
    padding: "15px 20px",
    borderBottom: isDarkTheme ? "1px solid #333" : "1px solid #ffccd5",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    backgroundColor: isDarkTheme ? "#121212" : "#ffe4e8",
  };

  const bodyStyle = {
    padding: "20px",
    display: isExpanded ? "block" : "none",
  };

  const inputStyle = {
    backgroundColor: isDarkTheme ? "#2a2a2a" : "white",
    border: isDarkTheme ? "1px solid #444" : "1px solid #ddd",
    color: isDarkTheme ? "#e6e6e6" : "inherit",
    padding: "8px 12px",
    borderRadius: "4px",
    width: "100%",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    color: isDarkTheme ? "#e6e6e6" : "inherit",
  };

  const hintStyle = {
    fontSize: "0.8rem",
    color: isDarkTheme ? "#999" : "#666",
    marginTop: "4px",
  };

  const buttonStyle = {
    backgroundColor: isDarkTheme ? "#ef4a82" : "#c10f45",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "8px 15px",
    cursor: "pointer",
    fontSize: "14px",
  };

  const removeButtonStyle = {
    backgroundColor: "#ff4d4f",
    color: "white",
    border: "none",
    borderRadius: "4px",
    width: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "16px",
  };

  const commandHeaderStyle = {
    padding: "15px 20px",
    borderBottom: isDarkTheme ? "1px solid #333" : "1px solid #ffccd5",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    backgroundColor: isDarkTheme ? "#121212" : "#ffe4e8",
  };

  const commandBodyStyle = {
    display: isCommandExpanded ? "block" : "none",
  };

  return (
    <div>
      {/* Command Builder Section */}
      <div style={containerStyle}>
        <div style={headerStyle} onClick={() => setIsExpanded(!isExpanded)}>
          <Heading as="h3" style={{ margin: 0, fontSize: "1.25rem" }}>
            Confidential Space Command Builder
          </Heading>
          <span>{isExpanded ? "▲" : "▼"}</span>
        </div>

        <div style={bodyStyle}>
          {/* First row - Track selection */}
          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="track" style={labelStyle}>
              Track
            </label>
            <select
              id="track"
              name="track"
              value={formState.track}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="Social AI Agents">Social AI Agents</option>
              <option value="RAG Knowledge">RAG Knowledge</option>
              <option value="AI x DeFi (DeFAI)">AI x DeFi (DeFAI)</option>
              <option value="Consensus Learning">Consensus Learning</option>
            </select>
            <div style={hintStyle}>Zone: {trackZoneMap[formState.track]}</div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            {/* First column */}
            <div>
              <div style={{ marginBottom: "20px" }}>
                <label htmlFor="instanceName" style={labelStyle}>
                  Instance Name
                </label>
                <input
                  id="instanceName"
                  name="instanceName"
                  type="text"
                  value={formState.instanceName}
                  onChange={handleChange}
                  style={inputStyle}
                />
                <div style={hintStyle}>
                  Default: $INSTANCE_NAME from your .env file (format:
                  PROJECT_NAME-TEAM_NAME)
                </div>
              </div>

              <div>
                <label htmlFor="platform" style={labelStyle}>
                  Platform Type
                </label>
                <select
                  id="platform"
                  name="platform"
                  value={formState.platform}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="AMD SEV">AMD SEV</option>
                  <option value="Intel TDX">Intel TDX</option>
                </select>
              </div>
            </div>

            {/* Second column */}
            <div>
              <div style={{ marginBottom: "20px" }}>
                <label htmlFor="zone" style={labelStyle}>
                  Zone (Set by Track)
                </label>
                <input
                  id="zone"
                  name="zone"
                  type="text"
                  value={formState.zone}
                  disabled
                  style={{
                    ...inputStyle,
                    backgroundColor: isDarkTheme ? "#1a1a1a" : "#f0f0f0",
                  }}
                />
              </div>

              <div>
                <label htmlFor="machineType" style={labelStyle}>
                  Machine Type
                </label>
                <input
                  id="machineType"
                  name="machineType"
                  type="text"
                  value={formState.machineType}
                  onChange={handleChange}
                  style={inputStyle}
                />
                <div style={hintStyle}>
                  Default: {platformConfigs[formState.platform].machineType}
                </div>
              </div>
            </div>
          </div>

          {/* TEE Image Reference */}
          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="imageReference" style={labelStyle}>
              TEE Image Reference
            </label>
            <input
              id="imageReference"
              name="imageReference"
              type="text"
              value={formState.imageReference}
              onChange={handleChange}
              style={inputStyle}
            />
            <div style={hintStyle}>
              Default: $TEE_IMAGE_REFERENCE from your .env file (e.g.
              ghcr.io/flare-foundation/flare-ai-social:main)
            </div>
          </div>

          {/* Environment Variables */}
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <label style={labelStyle}>Environment Variables</label>
              <button onClick={addEnvVar} style={buttonStyle}>
                Add Variable
              </button>
            </div>
            <div style={hintStyle}>
              Environment variables are by default loaded from your .env file
            </div>

            {formState.envVars.map((envVar, index) => (
              <div
                key={index}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr auto",
                  gap: "10px",
                  marginBottom: "10px",
                }}
              >
                <input
                  type="text"
                  value={envVar.name}
                  onChange={(e) =>
                    handleEnvVarChange(index, "name", e.target.value)
                  }
                  placeholder="Variable Name"
                  style={inputStyle}
                />
                <input
                  type="text"
                  value={envVar.value}
                  onChange={(e) =>
                    handleEnvVarChange(index, "value", e.target.value)
                  }
                  placeholder="Value"
                  style={inputStyle}
                />
                <button
                  onClick={() => removeEnvVar(index)}
                  aria-label="Remove environment variable"
                  style={removeButtonStyle}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Include Platform Comment - Removed since comments are no longer used */}
        </div>
      </div>

      {/* Generated Command Section */}
      <div style={containerStyle}>
        <div
          style={commandHeaderStyle}
          onClick={() => setIsCommandExpanded(!isCommandExpanded)}
        >
          <Heading as="h3" style={{ margin: 0, fontSize: "1.25rem" }}>
            Generated Command
          </Heading>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {docusaurusContext && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard();
                }}
                style={{
                  ...buttonStyle,
                  backgroundColor: copied
                    ? "#52c41a"
                    : buttonStyle.backgroundColor,
                }}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
            <span>{isCommandExpanded ? "▲" : "▼"}</span>
          </div>
        </div>

        <div style={commandBodyStyle}>
          <CodeBlock language="bash" className="margin-bottom--none">
            {command}
          </CodeBlock>
        </div>
      </div>
    </div>
  );
}
