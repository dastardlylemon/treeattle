import { ReactNode } from "react";
import {
  Badge,
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
      <div>
        <Text tt="uppercase" fz="xs" c="dimmed">
          {label}
        </Text>
        <Text fz="sm">{value}</Text>
      </div>
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
        <Badge color="lime" size="sm">
          {id}
        </Badge>
        <Space h="xs" />
        <Title order={4}>{commonName}</Title>
        <Text fs="italic" c="dimmed">
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
            value={diameter}
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
