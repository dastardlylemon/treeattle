import { ReactNode } from "react";
import {
  Badge,
  Box,
  Divider,
  Grid,
  Group,
  Paper,
  Space,
  ThemeIcon,
  Title,
  Text,
} from "@mantine/core";
import {
  IconCertificate,
  IconCrown,
  IconMapPin,
  IconRulerMeasure,
  IconSeeding,
} from "@tabler/icons-react";
import { Owner } from "../types/filters";

type MapPopupProps = {
  commonName: string;
  scientificName: string;
  diameter: number;
  heritage: string;
  ownership: Owner;
  plantedDate: string;
  location: string;
  id: string;
};

// this is rendered outside of the theme provider, so we have to add manually
const typographyStyle = { fontFamily: "Work Sans, sans-serif" };

function DataCell({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <Group>
      <ThemeIcon size="sm" variant="light" color="lime">
        {icon}
      </ThemeIcon>
      <Box sx={{ flex: 1}}>
        <Text
          tt="uppercase"
          size="0.7rem"
          fw="500"
          c="dimmed"
          sx={typographyStyle}
        >
          {label}
        </Text>
        <Text fz="sm" fw="500" sx={typographyStyle}>
          {value}
        </Text>
      </Box>
    </Group>
  );
}

export default function MapPopup({
  commonName,
  scientificName,
  diameter,
  heritage,
  ownership,
  plantedDate,
  location,
  id,
}: MapPopupProps) {
  return (
    <Paper shadow="md" p="md" radius="md" style={{ minWidth: 300 }}>
      <div>
        <Badge color="lime" size="sm" sx={typographyStyle}>
          {id}
        </Badge>
        <Space h="xs" />
        <Title order={3} sx={typographyStyle}>
          {commonName}
        </Title>
        <Text fs="italic" c="dimmed" sx={typographyStyle}>
          {scientificName}
        </Text>
      </div>
      <Divider my="md" />
      <Grid grow gutter={3}>
        <Grid.Col span={6}>
          <DataCell
            icon={<IconCrown />}
            label="Heritage"
            value={heritage === "N" ? "No" : "Yes"}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <DataCell
            icon={<IconRulerMeasure />}
            label="Diameter"
            value={`${diameter}"`}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <DataCell
            icon={<IconCertificate />}
            label="Owner"
            value={ownership === Owner.SDOT ? "SDOT" : "Private"}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <DataCell
            icon={<IconSeeding />}
            label="Planted"
            value={new Date(plantedDate).toLocaleDateString()}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <DataCell icon={<IconMapPin />} label="Location" value={location} />
        </Grid.Col>
      </Grid>
    </Paper>
  );
}
