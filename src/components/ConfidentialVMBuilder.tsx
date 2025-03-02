import React, { useState, useCallback, useEffect } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import CodeBlock from "@theme/CodeBlock";
import Heading from "@theme/Heading";
import { useColorMode } from "@docusaurus/theme-common";

type Platform = "AMD SEV" | "Intel TDX";
type EnvVar = { name: string; value: string };

export default function ConfidentialVMBuilder(): JSX.Element {
  const { isClient } = useDocusaurusContext();
  const { colorMode } = useColorMode();
  const isDarkTheme = colorMode === "dark";

  const [isExpanded, setIsExpanded] = useState(true);
  const [isCommandExpanded, setIsCommandExpanded] = useState(true);
  const [copied, setCopied] = useState(false);
  const [formState, setFormState] = useState({
    instanceName: "my-confidential-vm",
    platform: "AMD SEV" as Platform,
    zone: "us-central1-c",
    machineType: "n2d-standard-2",
    imageReference: "gcr.io/your-project/your-tee-image:latest",
    envVars: [
      { name: "EXAMPLE_VAR", value: "example-value" },
      { name: "", value: "" },
    ] as EnvVar[],
    includeComment: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormState((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleEnvVarChange = (
    index: number,
    field: "name" | "value",
    value: string,
  ) => {
    setFormState((prev) => {
      const newEnvVars = [...prev.envVars];
      newEnvVars[index][field] = value;
      return { ...prev, envVars: newEnvVars };
    });
  };

  const addEnvVar = () => {
    setFormState((prev) => ({
      ...prev,
      envVars: [...prev.envVars, { name: "", value: "" }],
    }));
  };

  const removeEnvVar = (index: number) => {
    setFormState((prev) => {
      const newEnvVars = [...prev.envVars];
      newEnvVars.splice(index, 1);
      return { ...prev, envVars: newEnvVars };
    });
  };

  const getPlatformDefaults = (platform: Platform) => {
    const defaults = {
      "AMD SEV": {
        zone: "us-central1-c",
        machineType: "n2d-standard-2",
        cpuPlatform: '--min-cpu-platform="AMD Milan"',
        maintenancePolicy: "--maintenance-policy=MIGRATE",
        image:
          "projects/confidential-space-images/global/images/confidential-space-debug-250100",
        diskType: "pd-standard",
        computeType: "--confidential-compute-type=SEV",
      },
      "Intel TDX": {
        zone: "us-central1-a",
        machineType: "c3-standard-4",
        cpuPlatform: "",
        maintenancePolicy: "--maintenance-policy=TERMINATE",
        image:
          "projects/confidential-space-images/global/images/confidential-space-debug-0-tdxpreview-c38b622",
        diskType: "pd-balanced",
        computeType: "--confidential-compute-type=TDX",
      },
    };

    return defaults[platform];
  };

  // Update zone and machine type when platform changes
  useEffect(() => {
    const defaults = getPlatformDefaults(formState.platform);
    setFormState((prev) => ({
      ...prev,
      zone: defaults.zone,
      machineType: defaults.machineType,
    }));
  }, [formState.platform]);

  const buildCommand = () => {
    const { instanceName, platform, envVars, imageReference, includeComment } =
      formState;
    const config = getPlatformDefaults(platform);

    // Use form values if provided, otherwise use defaults
    const zone = formState.zone || config.zone;
    const machineType = formState.machineType || config.machineType;

    let envVarsString = "";

    if (envVars.length > 0) {
      const filteredEnvVars = envVars.filter((v) => v.name && v.value);
      if (filteredEnvVars.length > 0) {
        envVarsString = filteredEnvVars
          .map((v) => `tee-env-${v.name}=${v.value}`)
          .join(" \\\n");

        envVarsString =
          "tee-container-log-redirect=true,\\\n" + envVarsString + " \\";
      } else {
        envVarsString = "tee-container-log-redirect=true,\\";
      }
    } else {
      envVarsString = "tee-container-log-redirect=true,\\";
    }

    const commandArray = [
      `gcloud compute instances create ${instanceName} \\`,
      `  --project=verifiable-ai-hackathon \\`,
      `  --zone=${zone} \\`,
      `  --machine-type=${machineType} \\`,
      `  --network-interface=network-tier=PREMIUM,nic-type=GVNIC,stack-type=IPV4_ONLY,subnet=default \\`,
      `  --metadata=tee-image-reference=${imageReference},\\`,
      `${envVarsString}`,
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

    let commandString = commandArray.join("\n");

    // Add platform-specific comments if requested
    if (includeComment) {
      const comment =
        platform === "AMD SEV"
          ? "# AMD SEV Confidential VM\n"
          : "# Intel TDX Confidential VM\n";
      commandString = comment + commandString;
    }

    return commandString;
  };

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
            Confidential VM Command Builder
          </Heading>
          <span>{isExpanded ? "▲" : "▼"}</span>
        </div>

        <div style={bodyStyle}>
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
              </div>

              <div>
                <label htmlFor="zone" style={labelStyle}>
                  Zone
                </label>
                <input
                  id="zone"
                  name="zone"
                  type="text"
                  value={formState.zone}
                  onChange={handleChange}
                  style={inputStyle}
                />
                <div style={hintStyle}>
                  Default: {getPlatformDefaults(formState.platform).zone}
                </div>
              </div>
            </div>

            {/* Second column */}
            <div>
              <div style={{ marginBottom: "20px" }}>
                <label htmlFor="platform" style={labelStyle}>
                  Platform Type
                </label>
                <select
                  id="platform"
                  name="platform"
                  value={formState.platform}
                  onChange={
                    handleChange as React.ChangeEventHandler<HTMLSelectElement>
                  }
                  style={inputStyle}
                >
                  <option value="AMD SEV">AMD SEV</option>
                  <option value="Intel TDX">Intel TDX</option>
                </select>
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
                  Default: {getPlatformDefaults(formState.platform).machineType}
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

          {/* Include Platform Comment */}
          <div style={{ marginBottom: "10px" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                color: isDarkTheme ? "#e6e6e6" : "inherit",
              }}
            >
              <input
                type="checkbox"
                name="includeComment"
                checked={formState.includeComment}
                onChange={handleChange}
                style={{ marginRight: "8px" }}
              />
              <span>Include platform comment</span>
            </label>
          </div>
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
            {isClient && (
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
